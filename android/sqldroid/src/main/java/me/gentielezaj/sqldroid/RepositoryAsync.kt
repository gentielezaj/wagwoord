package me.gentielezaj.sqldroid

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import me.gentielezaj.sqldroid.query.ICriteria
import me.gentielezaj.sqldroid.query.QueryBuilder
import kotlin.reflect.KClass

class RepositoryAsync<TDatabase : SqlDroidConfiguration, TEntity : Any>(
    val db: TDatabase,
    val entity: KClass<TEntity>,
    val context: Context
) {
    val queryBuilder: QueryBuilder<TEntity>
        get() = QueryBuilder.create<TEntity>(entity)

    private val repository = Repository<TDatabase, TEntity>(db, entity, context)

    suspend fun get(id: Any?) : TEntity? = run { repository.get(id) }

    // region any
    suspend fun any(query: IQueryCriteria<TEntity>?) : Boolean = run { repository.any(query) }
    // endregion any

    // region tolist
    suspend fun toList(query: IQueryCriteria<TEntity>? = null) : List<TEntity> = run { repository.toList(query) }
    // endregion

    // region first
    suspend fun firstOrNull(query: IQueryCriteria<TEntity>?) : TEntity? = run { repository.firstOrNull(query) }
    suspend fun first(query: IQueryCriteria<TEntity>?) : TEntity = run { repository.first(query) }
    // endregion first

    // endregion read

    // region write
    suspend fun save(model: TEntity, foreignDepended: Boolean = true) : Int = run { repository.save(model, foreignDepended) }
    suspend fun insert(model: TEntity, foreignDepended: Boolean = true) : Int  = run { repository.insert(model, foreignDepended) }
    suspend fun update(model: TEntity, foreignDepended: Boolean = true) : Int = run { repository.update(model, foreignDepended) }
    // endregion write

    private suspend fun <T> run(statement: () -> T): T = suspendCancellableCoroutine<T> { continuation ->
        continuation.resume(statement(), {})
    }
}