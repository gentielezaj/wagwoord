package me.gentielezaj.wagwoord.services.entity

import android.content.Context
import android.location.Criteria
import me.gentielezaj.sqldroid.IQueryBuilder
import me.gentielezaj.sqldroid.RepositoryAsync
import me.gentielezaj.sqldroid.models.TableInfo
import me.gentielezaj.sqldroid.query.*
import me.gentielezaj.sqldroid.query.Restriction.Companion.contains
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.common.ServerStatus
import me.gentielezaj.wagwoord.common.empty
import me.gentielezaj.wagwoord.database.Database
import me.gentielezaj.wagwoord.models.annotations.*
import me.gentielezaj.wagwoord.models.common.SaveErrorCodes
import me.gentielezaj.wagwoord.models.common.SaveResult
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntityCount
import me.gentielezaj.wagwoord.models.entities.coreEntities.SyncStatus
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.services.BaseService
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.proxy.ProxyService
import kotlin.reflect.KClass
import kotlin.reflect.KMutableProperty1
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties


abstract class CoreService<T>(context: Context) : BaseService(context)  where T: IEntity {

    open suspend fun sync() : Boolean = syncLocal() && syncServer()

    abstract suspend fun syncServer() : Boolean

    abstract suspend fun syncLocal() : Boolean
}

open class CoreEntityService<T: IEntity>(context: Context, protected val type: KClass<T>, private val controller: String? = null) : CoreService<T>(context) {
    private val encryptionService = EncryptionService(context)

    private val localStorageDeleteKey = type.simpleName + "DeletedEntities"
    private val lastModifiedKey
        get() = type.simpleName + "LastModified"

    private val proxy = ProxyService(context, getControllerName())
    private val db = Database(context)
    protected val repository = RepositoryAsync(db, type, context)
    private val classType: Class<T> get() { return type.java  }
    private val tableInfo = TableInfo.create(type)

    private fun getControllerName() : String {
        if(!controller.isNullOrEmpty()) return controller!!
        return classType.simpleName.replace("Entity", "")
    }

    // region get

    suspend fun list(text: String? = String.empty) : List<T> = coreList(text)

    protected open suspend fun coreList(text: String?) : List<T> {
        val properties = type.memberProperties.filter { it.findAnnotation<ListData>() != null }

        if(properties.isEmpty()) return repository.toList()

        val query = repository.queryBuilder
        val criteria = mutableListOf<ICriteria<T>>()
        for(property in properties) {
            val listData = property.findAnnotation<ListData>()!!
            if(listData.searchable && !text.isNullOrEmpty()) criteria.add(property contains text)
            if(listData.orderBy != ListDataOrderDirection.None) query.orderBy(Order.By(property, orderDirection(listData.orderBy)!!))
        }

        if(criteria.any()) query.where(Where.OR(criteria))
        return repository.toList(query)
    }


    suspend fun item(id : Int) : T? = repository.get(id)
    // endregion get

    // region save
    suspend fun save(model: T) : SaveResult<T> {
        model.lastModified = System.currentTimeMillis()
        return coreSave(model, false)
    }

    suspend fun saveOrUpdate(model: T) : SaveResult<T> {
        model.lastModified = System.currentTimeMillis()
        return coreSave(model, true)
    }

    private suspend fun coreSave(entity: T, canUpdate: Boolean) : SaveResult<T> {
        var model = entity
        if(!isValidModel(model)) return SaveResult(model, SaveErrorCodes.INVALID_MODEL)

        val oldItem: T?
        oldItem = when {
            model.id > 0 -> {
                repository.get(model.id)
            }
            model.serverId != null -> {
                repository.firstOrNull(Restriction.eq(type, "serverId", model.serverId))
            }
            else -> {
                val existingId = hasUniqueConflict(model)
                if(!canUpdate && existingId != null) return SaveResult(model, SaveErrorCodes.ITEM_ALREADY_EXISTS)
                repository.firstOrNull(Restriction.eq(type, "serverId", model.serverId))
            }
        }

        if(oldItem != null) {
            model.id = oldItem.id
            model.serverId = oldItem.serverId?:model.serverId
        }

        if(model.sync == SyncStatus.Syncing && serviceUtilities.hasInternetConnection()) {
            model = syncServerItem(model)
        }

        try {
            val savedEntity = repository.save(model)
            return SaveResult(model, savedEntity)
        } catch (e: Exception) {
            LogData(e, "Save model")
            throw e
        }
    }

    private suspend fun hasUniqueConflict(model: T) : Int? {
        val query = Where.AND<T>()
        for (property in type.memberProperties.filter {it.findAnnotation<Identifier>() != null }) {
            query.criteria.add(property eq property.get(model))
        }

        if(query.criteria.isEmpty()) return null

        return repository.firstOrNull(query)?.id
    }

    private fun isValidModel(model : T) : Boolean {
        for(column in tableInfo.columns.filter { !it.nullable }) {
            if(column.get(model) == null) return false
        }

        return true
    }
    // endregion save

    // region delete

    suspend fun delete(entity: T, sync: Boolean = true) {
        if(sync && entity.serverId != null && !proxy.delete(entity.serverId!!).success) {
            var ids = localStorage.get(localStorageDeleteKey, String.empty)
            ids += "${entity.serverId},"
            localStorage.set(localStorageDeleteKey, ids)
        }

        if(entity.id > 0) repository.delete(entity)
        else repository.delete(Restriction.eq(type, "serverId", entity.serverId))
    }

    private suspend fun syncDeleted() {
        val ids = localStorage.get<String>(localStorageDeleteKey)
        if(!ids.isNullOrEmpty()) {
            if(proxy.delete(ids).success) localStorage.remove(localStorageDeleteKey)
        }
    }

    // endregion delete

    // region sync

    suspend fun hasInternetConnectionAndServerSet() : Boolean {
        val internet = serviceUtilities.hasInternetConnection()
        return internet && proxy.isSet(false) == ServerStatus.OK
    }

    override suspend fun syncServer() : Boolean {
        if(!hasInternetConnectionAndServerSet()) return false
        syncDeleted()
        val list = repository.toList(Restriction.eq(type, "sync", SyncStatus.Syncing))
        val request = proxy.request<List<T>>(RequestData.Post(list))

        return request.success
    }

    private suspend fun syncServerItem(entity: T) : T {
        var model = entity
        if(!hasInternetConnectionAndServerSet()) model.sync = SyncStatus.Syncing
        val request = proxy.request<T>(type, RequestData.Post(model))
        model = request.data?:model

        model.sync = if(request.success) SyncStatus.Synced else SyncStatus.Syncing

        return model
    }

    override suspend fun syncLocal() : Boolean {
        try {

            if(!hasInternetConnectionAndServerSet()) return false

            val lastModified = localStorage.get<Long>(lastModifiedKey)?:0L
            val response = proxy.requestList<T>(type, RequestData.Patch(mapOf("lastModified" to lastModified.toString())))
            if(!response.success) {
                return false
            }

            if(response.data?.any() == true) {
                for (i in response.data!!) {
                    if(i.deleted) delete(i, false)

                    var item = i
                    if(item.encrypted) item = decryptData(item)
                    item.sync = SyncStatus.Synced
                    saveOrUpdate(item)
                }
            }

            localStorage.set(lastModifiedKey, System.currentTimeMillis())

            return true
        } catch (e: Exception) {
            throw e
        }
    }

    private fun decryptData(item: T) : T {
        if(!item.encrypted) return item
        val cryptoProperties = type.memberProperties.filter { it.findAnnotation<Encrypt>() != null }
        if(cryptoProperties.isEmpty()) {
            item.encrypted = false
            return item
        }

        for (property in cryptoProperties) {
            val value: Any? = property.get(item) ?: continue
            val dData = encryptionService.decrypt(value.toString())
            @Suppress("UNCHECKED_CAST") val m = property as KMutableProperty1<T, String>
            m.set(item, dData)
        }

        item.encrypted = false
        return item
    }
    // endregion sync
}


open class CoreEntityCountService<T>(context: Context, type: KClass<T>, controller: String? = null) : CoreEntityService<T>(context, type, controller) where T: IEntityCount
