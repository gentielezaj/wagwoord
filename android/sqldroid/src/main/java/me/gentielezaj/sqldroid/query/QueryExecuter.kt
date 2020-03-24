package me.gentielezaj.sqldroid.query

import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.os.Parcel
import android.os.Parcelable
import me.gentielezaj.sqldroid.IQuery
import me.gentielezaj.sqldroid.IQueryBuilder
import me.gentielezaj.sqldroid.common.columnInfo
import me.gentielezaj.sqldroid.exceptions.queryExectution.MultipleRowsException
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1

class QueryExecuterEntity<T: Any>(
    database: SQLiteDatabase,
    from: TableInfo,
    where: Where<T> = Where.AND(),
    joins: MutableCollection<JoinQueryBuilder<*>>? = null,
    orders: MutableCollection<Order<T>>? = null,
    alias: String = "",
    take: Int? = null,
    skip: Int? = null) : QueryExecuter<T, T>(database, from, null, where, joins, orders, alias, take, skip, {cursor: Cursor -> from.setValues(cursor)})


private fun setValueMap(cursor: Cursor, select: MutableCollection<ColumnInfo>?) : Map<KProperty1<out Any, out Any?>, Any?> {
    var results = mutableMapOf<KProperty1<out Any, out Any?>, Any?>()
    for (column in select!!) {
        results.put(column.property, column.get(cursor))
    }
    return results
}

class QueryExecuterMap<T: Any>(
    database: SQLiteDatabase,
    from: TableInfo,
    select: MutableCollection<ColumnInfo>? = mutableListOf(),
    where: Where<T> = Where.AND(),
    joins: MutableCollection<JoinQueryBuilder<*>>? = null,
    orders: MutableCollection<Order<T>>? = null,
    alias: String = "",
    take: Int? = null,
    skip: Int? = null) : QueryExecuter<T, Map<KProperty1<out Any, out Any?>, Any?>>(database, from, select, where, joins, orders, alias, take, skip,
    {cursor: Cursor -> setValueMap(cursor, select) })


class QueryExecuterDynamic<T: Any, TResult: Any>(
    database: SQLiteDatabase,
    from: TableInfo,
    select: ColumnInfo,
    where: Where<T> = Where.AND(),
    joins: MutableCollection<JoinQueryBuilder<*>>? = null,
    orders: MutableCollection<Order<T>>? = null,
    alias: String = "",
    take: Int? = null,
    skip: Int? = null) : QueryExecuter<T, TResult>(database, from, mutableListOf(select), where, joins, orders, alias, take, skip, {c: Cursor -> select.get<TResult>(c)!! })

open class QueryExecuter<T : Any, TResult : Any>(
    val database: SQLiteDatabase,
    override val from: TableInfo,
    override var select: MutableCollection<ColumnInfo>? = mutableListOf(),
    override var where: Where<T> = Where.AND(),
    override var joins: MutableCollection<JoinQueryBuilder<*>>? = null,
    override var orders: MutableCollection<Order<T>>? = null,
    override var alias: String = "",
    override var take: Int? = null,
    override var skip: Int? = null,
    val bindData:(cursor: Cursor) -> TResult
) : CoreQueryBuilder<T, IQuery<T, TResult>, IQuery<T, T>, IQuery<T, Map<KProperty1<out Any, out Any?>, out Any?>>>(), IQuery<T, TResult> {

    init {
        if (alias.isNullOrEmpty()) {
            alias = from.name
        }
    }

    // region select
    override fun selectAll() : IQuery<T, T> {
        select = null;
        return QueryExecuterEntity<T>(database, from, where, joins, orders, alias, take, skip)
    }

    override fun selects(vararg properties: KProperty1<T, Any?>): IQuery<T, Map<KProperty1<out Any, out Any?>, out Any?>> {
        selectOpr(properties.toList(), false)
        return QueryExecuterMap<T>(database, from, select, where, joins, orders, alias, take, skip)
    }

    override fun <TValue: Any> select(property: KProperty1<T, TValue?>): IQuery<T, TValue> {
        return QueryExecuterDynamic<T, TValue>(database, from, property.columnInfo(), where, joins, orders, alias, take, skip)
    }
    // endregion selet

    // region execute
    override fun toList(criteria: ICriteria<T>?): List<TResult> {
        val c: Cursor = execute(criteria)
        var results = mutableListOf<TResult>()
        if (c.moveToFirst()) {
            do {
                results.add(bindData(c))
            } while (c.moveToNext())
        }
        c.close()

        return results;
    }

    override fun firstOrNull(criteria: ICriteria<T>?): TResult? {
        val c: Cursor = execute(criteria)
        val results = if (c.moveToFirst()) bindData(c) else null
        c.close()
        return results;
    }

    override fun uniqueOrNull(criteria: ICriteria<T>?): TResult? {
        val c: Cursor = execute(criteria)
        if (c.count > 1) throw MultipleRowsException()
        val results = if (c.moveToLast()) bindData(c) else null
        c.close()
        return results;
    }

    override fun singleOrNull(criteria: ICriteria<T>?): TResult? {
        take(1)
        val c: Cursor = execute(criteria)
        val results = if (c.moveToLast()) bindData(c) else null
        c.close()
        return results;
    }

    override fun lastOrNull(criteria: ICriteria<T>?): TResult? {
        val c: Cursor = execute(criteria)
        val results = if (c.moveToLast()) bindData(c) else null
        c.close()
        return results;
    }

    override fun count(criteria: ICriteria<T>?): Int = execute(criteria).count

    fun execute(criteria: ICriteria<T>? = null): Cursor {
        if (criteria != null) where(criteria!!);
        val sql = toSqlString()
        return database.rawQuery(sql, null)
    }
    // endregion
}