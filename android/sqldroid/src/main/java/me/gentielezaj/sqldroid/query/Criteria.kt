package me.gentielezaj.sqldroid.query

import me.gentielezaj.sqldroid.IQueryCriteria
import me.gentielezaj.sqldroid.SqlBuilder
import me.gentielezaj.sqldroid.common.DatePatterns
import me.gentielezaj.sqldroid.common.tableInfo
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.TableInfo
import org.jetbrains.exposed.sql.vendors.currentDialect
import org.slf4j.MDC.put
import java.lang.Exception
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAccessor
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties

enum class WhereConditions {
    AND, OR
}

interface ICriteria<T: Any> : SqlBuilder<T>, IQueryCriteria<T>

data class Restriction<T: Any> internal constructor(val tableInfo: TableInfo, val columnInfo: ColumnInfo, val condition: String, val value: Any?) : ICriteria<T> {

    override fun toSqlString(alias: String?) : String {
        val alias = if(alias.isNullOrEmpty()) tableInfo.name else alias
        val sql = """$alias."${columnInfo.name}" $condition ${valueToString()}"""
        return sql
    }

    private fun valueToString(v: Any? = null) : String {
        var currentValue = v?:value
        if(currentValue is Iterable<out Any?>) {
            var values = currentValue.map { valueToString(it) }
            return "(" + values.joinToString(", ") + ")"
        }

        if(currentValue == null) return "null"

        if(columnInfo.converter != null) {
            currentValue = columnInfo.converter.java.newInstance().write(currentValue)
        }

        return when(columnInfo.type) {
            ColumnType.BIGINT,
                ColumnType.INT,
                ColumnType.REAL -> currentValue.toString()
            ColumnType.BOOLEAN -> convertBoolean(currentValue!!)
            ColumnType.DATE -> convertToDate(currentValue!!, DatePatterns.date)
            ColumnType.DATETIME -> convertToDate(currentValue!!, DatePatterns.dateTime)
            ColumnType.TIME -> convertToDate(currentValue!!, DatePatterns.time)
            else -> "'" + currentValue.toString() + "'"
        }
    }

    private fun convertToDate(value: Any, pattern: String) : String {
        if (value !is TemporalAccessor) throw Exception("Restriction: Unsupported covert to datetime");
        val format = DateTimeFormatter.ofPattern(DatePatterns.time)
        return format.format(currentDialect as TemporalAccessor)
    }

    private fun convertBoolean(value: Any) : String {
        if (value !is Boolean) throw Exception("Restriction: Unsupported covert to bool");
        return if(value) "1" else "0"
    }

    companion object {
        fun <T: Any> create(property: KProperty1<T, Any?>, condition: String, value: Any?, table: KClass<T>? = null) : Restriction<T> {
            var tableInfo = if(table != null) TableInfo.create(table) else property.tableInfo();
            return Restriction(tableInfo, tableInfo.columns.first{it.property.name ==property.name}, condition, value);
        }

        // region defaults
        fun <T: Any> KProperty1<T, out Any?>.isNull() : ICriteria<T> = create(this, "IS", null)
        fun <T: Any> KProperty1<T, out Any?>.notNull() : ICriteria<T> = create(this, "IS NOT", null)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.notEq(value: P?) : ICriteria<T> = create(this, "<>", value)

        inline fun <reified T: Any, P: Any?> eq(property: String, value: P) : ICriteria<T> = eq(T::class, property, value)
        inline fun <T: Any, P: Any?> eq(entity: KClass<T>, property: String, value: P) : ICriteria<T> = create(entity.memberProperties.first { it.name == property }, "=", value, entity)
        fun <T: Any, P: Any?> eq(property: KProperty1<T, P>, value: P) : ICriteria<T> = create(property, "=", value)

        infix fun <T: Any, P: Any?> KProperty1<T, P?>.inTo(value: Iterable<P?>) : ICriteria<T> = create(this, "IN", value)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.notIn(value: Iterable<P?>) : ICriteria<T> = create(this, "NOT IN", value)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.gt(value: P?) : ICriteria<T> = create(this, ">", value)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.lo(value: P?) : ICriteria<T> = create(this, "<", value)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.gtEq(value: P?) : ICriteria<T> = create(this, ">=", value)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.loEq(value: P?) : ICriteria<T> = create(this, "<=", value)
        // endregion

        // region strings
        infix fun <T: Any, P: Any?> KProperty1<T, String>.contains(value: P?) : ICriteria<T> = create(this, "like", "%$value%")
        infix fun <T: Any, P: Any?> KProperty1<T, String>.endWith(value: P?) : ICriteria<T> = create(this, "like", "$value%")
        infix fun <T: Any, P: Any?> KProperty1<T, String>.startWith(value: P?) : ICriteria<T> = create(this, "like", "%$value")
        infix fun <T: Any, P: Any?> KProperty1<T, String>.like(value: P?) : ICriteria<T> = create(this, "like", value)
        // endregion
    }
}

data class Where<T: Any> internal constructor(var condition: WhereConditions?, var criteria: MutableCollection<ICriteria<T>>) : ICriteria<T> {
    override fun toSqlString(alias: String?): String {
        if(criteria.isEmpty()) return ""
        var sql = mutableListOf<String>()
        for(cr in criteria) {
            val sqlString = when (cr) {
                is Where<T> -> "(${cr.toSqlString(alias)})"
                else -> cr.toSqlString(alias)
            }
            sql.add(sqlString);
        }

        return sql.joinToString(" ${condition.toString()} ")
    }

    companion object {
        fun <T: Any> OR(criteria: MutableCollection<ICriteria<T>> = mutableListOf()) :  Where<T> = Where(WhereConditions.OR, criteria)
        fun <T: Any> AND(criteria: MutableCollection<ICriteria<T>> = mutableListOf()) :  Where<T> = Where(WhereConditions.AND, criteria)
        fun <T: Any> OR(vararg criteria: ICriteria<T>) :  Where<T>  = Where(WhereConditions.OR, criteria.toMutableList())
        fun <T: Any> AND(vararg criteria: ICriteria<T>) :  Where<T>  = Where(WhereConditions.AND, criteria.toMutableList())
    }
}