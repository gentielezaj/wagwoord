package me.gentielezaj.sqldroid.query

import me.gentielezaj.sqldroid.IQuery
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1

data class QueryBuilder<T: Any> protected constructor(val from: TableInfo, val select: MutableIterable<ColumnInfo> = mutableListOf(), var where: ICriteria = Where.AND()) : IQuery {
    override fun toSqlString() : String = ""

    companion object {
        inline fun <reified T: Any> Create(select: Iterable<KProperty1<T, Any>>) : QueryBuilder<T> = QueryBuilder<T>(TableInfo.create(T::class), select.map { ColumnInfo.create(it!!)!! }.toMutableList())
        inline fun <reified T: Any> Create(vararg select: KProperty1<T, Any>) : QueryBuilder<T> = QueryBuilder<T>(TableInfo.create(T::class),  select.map { ColumnInfo.create(it!!)!! }.toMutableList())
    }
}