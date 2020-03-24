package me.gentielezaj.sqldroid.query

import me.gentielezaj.sqldroid.SqlBuilder
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import kotlin.reflect.KProperty1
import kotlin.reflect.jvm.javaField

enum class OrderDirections {
    ASC, DESC
}

data class Order<T : Any> internal constructor(
    val table: TableInfo,
    val columnInfo: ColumnInfo,
    val direction: OrderDirections = OrderDirections.ASC
) : SqlBuilder<T> {
    override fun toSqlString(alias: String?) : String {
        val tableAlias = if(alias.isNullOrEmpty()) table.name else alias
        return """"$tableAlias"."${columnInfo.name}" $direction"""
    }

    var directionString: String = if (direction == OrderDirections.ASC) "ASC" else "DESC"

    companion object {
        fun <T : Any> By(property: KProperty1<T, Any?>, direction: OrderDirections = OrderDirections.ASC): Order<T> {
            var table = TableInfo.create(property.javaField!!.declaringClass.kotlin)
            return Order<T>(table, table.columns.first { it.property.name == property.name }, direction)
        }

        fun <T : Any> Asc(property: KProperty1<T, Any?>): Order<T> = By(property, OrderDirections.ASC)

        fun <T : Any> Desc(property: KProperty1<T, Any?>): Order<T> = By(property, OrderDirections.DESC)
    }
}