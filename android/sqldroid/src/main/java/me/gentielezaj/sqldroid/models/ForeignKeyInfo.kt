package me.gentielezaj.sqldroid.models

import me.gentielezaj.sqldroid.common.getClassFormGenericType
import me.gentielezaj.sqldroid.common.valueOrNull
import me.gentielezaj.sqldroid.exceptions.InvalidForeingKeyException
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.ForeignKey
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.*
import kotlin.reflect.jvm.javaField
import kotlin.reflect.jvm.javaType
import kotlin.reflect.typeOf


data class ForeignKeyInfo(val table: TableInfo, val column: ColumnInfo, val tablePoperty: KProperty1<Any, *>?) {
    companion object {
        fun create(clazz: KClass<*>) : List<ForeignKeyInfo>? {
            var res = mutableListOf<ForeignKeyInfo>()
            for(property in clazz.declaredMemberProperties) {
                val fColumn = create(property)
                if(fColumn != null) res.add(fColumn!!)
            }

            return if(res.isEmpty()) null else res
        }

        fun create(property: KProperty1<out Any, Any?>) : ForeignKeyInfo? {
            val clazz = property.javaField!!.declaringClass.kotlin!!
            val foreignKey = property.findAnnotation<ForeignKey>() ?: return null

            if(foreignKey.clazz == Unit::class && foreignKey.property.isNullOrEmpty()) {
                throw InvalidForeingKeyException(property.name, clazz.simpleName!!)
            }

            var fClass = foreignKey.clazz;
            var tablePoperty: KProperty1<out Any, Any?>? = null
            if(fClass == Unit::class) {
                val tablePoperty = clazz.memberProperties.find { it.name == foreignKey.property }
                if(tablePoperty == null) throw InvalidForeingKeyException(property.name, clazz.simpleName!!)
                fClass = tablePoperty.javaField!!.declaringClass.kotlin
            } else {
                tablePoperty = clazz.memberProperties.find { it.name == foreignKey.property }
            }

            val table = TableInfo.create(fClass)!!
            val fColumn = table.primaryKey

            if(table == null || fColumn == null || tablePoperty == null) throw InvalidForeingKeyException(property.name, clazz.simpleName!!)

            return ForeignKeyInfo(table, fColumn, property as KProperty1<Any, *>)
        }
    }
}

data class ForeignListInfo(val property: KProperty1<Any, *>, val foreignProperty: KProperty1<out Any, Any?>) {
    companion object {
        @Suppress("UNCHECKED_CAST")
        fun create(clazz: KClass<*>) : List<ForeignListInfo>? {
            var res = mutableListOf<ForeignListInfo>()
            for(property in clazz.declaredMemberProperties) {
                val info = property.findAnnotation<ForeignKey>();
                if(info != null && property.findAnnotation<Column>() == null && property.returnType.classifier == List::class) {
                    if(info.property.isNullOrEmpty()) throw InvalidForeingKeyException(property.name, clazz.simpleName!!)

                    var fClass = info.clazz
                    if(fClass == Unit::class) {
                        fClass = getClassFormGenericType(property.javaField!!.genericType)
                    }
                    val fProperty = fClass.declaredMemberProperties.first {it.name == info.property}
                    res.add(ForeignListInfo(property as KProperty1<Any, *>, fProperty))
                }
            }

            return if(res.any()) res else null
        }
    }
}