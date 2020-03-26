package me.gentielezaj.wagwoord.services.repositories

import android.content.Context
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.database.Database
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.proxy.ProxyService
import java.time.LocalDate
import kotlin.reflect.KClass

open class CoreRepository<T>(protected val context: Context, protected val type: KClass<T>, protected var controller: String?) where T: IEntity{
    constructor(context: Context, type: KClass<T>) : this(context, type, null)
    constructor(context: Context, type: Class<T>) : this(context, type.kotlin, null)

    protected val proxy = ProxyService(context, getControllerName())
    protected val db = Database(context)

    protected val classType: Class<T>
        get() {
            return type.java        }

    fun getControllerName() : String {
        if(!controller.isNullOrEmpty()) return controller!!;
        return classType.simpleName.replace("Entity", "")
    }

    fun save(model: T) : T {
        try {
            model.lastModified == model.lastModified?: "11111"
            db.write { model.id = it.save(model) as Long }
            return model;
        } catch (e: Exception) {
            LogData(e, "Save model")
            throw e
        }
    }
}