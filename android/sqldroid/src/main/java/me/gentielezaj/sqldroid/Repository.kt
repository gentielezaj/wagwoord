package me.gentielezaj.sqldroid

import android.content.Context
import me.gentielezaj.sqldroid.exceptions.querybuilder.NotSupportedConvertedTypeException
import me.gentielezaj.sqldroid.query.ICriteria
import me.gentielezaj.sqldroid.query.QueryBuilder
import me.gentielezaj.sqldroid.query.QueryExecuter
import java.time.temporal.Temporal
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1

class Repository<TDatabase: SqlDroidConfiguration, TEntity: Any>(val db: TDatabase, val entity: KClass<TEntity>, val context: Context) {
    val queryBuilder : QueryBuilder<TEntity>
        get() = QueryBuilder.create<TEntity>(entity)

    // region read

    fun get(id: Any?) : TEntity? = db.read {
        it.get(entity, id)
    }

    // region any
    fun any(query: IQueryCriteria<TEntity>?) : Boolean = db.read {
        when(query) {
            null -> it.getQuery(entity).any()
            is ICriteria<TEntity> -> it.getQuery(entity).any(query)
            is IQueryBuilder<TEntity> -> it.getQuery(entity, query).any()
            else -> throw NotSupportedConvertedTypeException()
        }
    }
    // endregion any

    // region to list
    fun toList(query: IQueryCriteria<TEntity>?) : List<TEntity> = db.read {
        when(query) {
            null -> it.getQuery(entity).toList()
            is ICriteria<TEntity> -> it.getQuery(entity).toList(query)
            is IQueryBuilder<TEntity> -> it.getQuery(entity, query).toList()
            else -> throw NotSupportedConvertedTypeException()
        }
    }
    // endregion

    // region first
    fun firstOrNull(query: IQueryCriteria<TEntity>?) : TEntity? = db.read {
        when(query) {
            null -> it.getQuery(entity).firstOrNull()
            is ICriteria<TEntity> -> it.getQuery(entity).firstOrNull(query)
            is IQueryBuilder<TEntity> -> it.getQuery(entity, query).firstOrNull()
            else -> throw NotSupportedConvertedTypeException()
        }
    }

    fun first(query: IQueryCriteria<TEntity>?) : TEntity = db.read {
        when(query) {
            null -> it.getQuery(entity).first()
            is ICriteria<TEntity> -> it.getQuery(entity).first(query)
            is IQueryBuilder<TEntity> -> it.getQuery(entity, query).first()
            else -> throw NotSupportedConvertedTypeException()
        }
    }
    // endregion first

    // endregion read

    // region write
    fun save(model: TEntity, foreignDepended: Boolean = true) : Int = db.write { it.save(model, foreignDepended) } as Int

    fun insert(model: TEntity, foreignDepended: Boolean = true) : Int  = db.write { it.insert(model, foreignDepended) } as Int

    fun update(model: TEntity, foreignDepended: Boolean = true) : Int = db.write { it.update(model, foreignDepended) } as Int

    fun delete(model: TEntity) {
        db.write { it.delete(entity) }
    }
    // endregion write
}