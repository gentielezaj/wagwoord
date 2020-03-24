package me.gentielezaj.sqldroid.common

import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import java.lang.reflect.Type
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.jvm.javaField

fun getClassFormGenericType(type: Type) : KClass<*> {
    val className = type.typeName.replace(".+<".toRegex(), "").replace(">", "")
    return Class.forName(className).kotlin
}

internal fun <T: Any> KProperty1<T, Any?>.columnInfo(tableInfo: TableInfo) : ColumnInfo = tableInfo.columns.firstOrNull{it.property.name == this.name} ?: ColumnInfo.create(this)!!
internal fun <T: Any> KProperty1<T, Any?>.columnInfo() : ColumnInfo = this.columnInfo(TableInfo.create(this.javaField!!.declaringClass.kotlin))
internal fun <T: Any> KProperty1<T, Any?>.tableInfo() : TableInfo = TableInfo.create(this.javaField!!.declaringClass.kotlin)