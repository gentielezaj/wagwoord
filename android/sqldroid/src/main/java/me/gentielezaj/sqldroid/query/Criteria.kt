package me.gentielezaj.sqldroid.query

import me.gentielezaj.sqldroid.SqlBuilder
import me.gentielezaj.sqldroid.common.tableInfo
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties

enum class WhereConditions {
    AND, OR
}

interface ICriteria<T: Any> : SqlBuilder<T>

data class Restriction<T: Any> internal constructor(val tableInfo: TableInfo, val columnInfo: ColumnInfo, val condition: String, val value: Any?) : ICriteria<T> {

    override fun toSqlString(alias: String?) : String {
        var alias = if(alias.isNullOrEmpty()) tableInfo.name else alias
        var sql = """$alias."${columnInfo.name}" $condition ${valueToString()}"""
        return sql
    }

    private fun valueToString() : String = when(value) {
        is Iterable<out Any?> -> "(" + value.joinToString(", ") + ")"
        null -> "null"
        is Boolean -> if(value) "1" else "0"
        else -> value.toString()
    }

    companion object {
        fun <T: Any> create(property: KProperty1<T, Any?>, condition: String, value: Any?) : Restriction<T> {
            var tableInfo = property.tableInfo();
            return Restriction(tableInfo, tableInfo.columns.first{it.property.name ==property.name}, condition, value);
        }

        // region defaults
        fun <T: Any> KProperty1<T, out Any?>.isNull() : ICriteria<T> = create(this, "IS", null)
        fun <T: Any> KProperty1<T, out Any?>.notNull() : ICriteria<T> = create(this, "IS NOT", null)
        infix fun <T: Any, P: Any?> KProperty1<T, P?>.notEq(value: P?) : ICriteria<T> = create(this, "<>", value)

        infix fun <T: Any, P: Any?> KProperty1<T, P?>.eq(value: P?) : ICriteria<T> = create(this, "=", value)
        inline fun <reified T: Any, P: Any?> eq(property: String, value: P?) : ICriteria<T> = create(T::class.declaredMemberProperties.first { it.name == property }, "=", value)

        infix fun <T: Any, P: Any?> KProperty1<T, out P?>.inTo(value: Iterable<P?>) : ICriteria<T> = create(this, "IN", value)
        infix fun <T: Any, P: Any?> KProperty1<T, out P?>.notIn(value: Iterable<P?>) : ICriteria<T> = create(this, "NOT IN", value)
        infix fun <T: Any, P: Any?> KProperty1<T, out P?>.gt(value: P?) : ICriteria<T> = create(this, ">", value)
        infix fun <T: Any, P: Any?> KProperty1<T, out P?>.lo(value: P?) : ICriteria<T> = create(this, "<", value)
        infix fun <T: Any, P: Any?> KProperty1<T, out P?>.gtEq(value: P?) : ICriteria<T> = create(this, ">=", value)
        infix fun <T: Any, P: Any?> KProperty1<T, out P?>.loEq(value: P?) : ICriteria<T> = create(this, "<=", value)
        // endregion

        // region strings
        infix fun <T: Any, P: Any?> KProperty1<T, out String>.contains(value: P?) : ICriteria<T> = create(this, "like", "%$value%")
        infix fun <T: Any, P: Any?> KProperty1<T, out String>.endWith(value: P?) : ICriteria<T> = create(this, "like", "$value%")
        infix fun <T: Any, P: Any?> KProperty1<T, out String>.startWith(value: P?) : ICriteria<T> = create(this, "like", "%$value")
        infix fun <T: Any, P: Any?> KProperty1<T, out String>.like(value: P?) : ICriteria<T> = create(this, "like", value)
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