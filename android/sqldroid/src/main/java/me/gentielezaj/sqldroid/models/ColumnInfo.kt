package me.gentielezaj.sqldroid.models

import android.database.Cursor
import androidx.annotation.Nullable
import androidx.core.database.getDoubleOrNull
import androidx.core.database.getIntOrNull
import androidx.core.database.getLongOrNull
import androidx.core.database.getStringOrNull
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.common.valueOrDefault
import me.gentielezaj.sqldroid.common.valueOrNull
import me.gentielezaj.sqldroid.exceptions.UnsuportedColumnTypeException
import me.gentielezaj.sqldroid.models.annotations.column.ForeignKey
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*
import kotlin.reflect.KMutableProperty
import kotlin.reflect.KMutableProperty1
import kotlin.reflect.KProperty1
import kotlin.reflect.KType
import kotlin.reflect.full.createType
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.isSubtypeOf
import kotlin.reflect.full.isSupertypeOf

data class ColumnInfo(val name: String,
                      val type: ColumnType,
                      val nullable: Boolean,
                      val length: Int,
                      val default: Any?,
                      val readOnly: Boolean,
                      val property: KMutableProperty1<Any, Any?>,
                      val primaryKey: PrimaryKeyInfo?,
                      val foreignKey: ForeignKeyInfo?) {

    val isAutoIncrement: Boolean
        get() = isPrimaryKey && type == ColumnType.INT && primaryKey?.autoincrement?: false

    val isPrimaryKey: Boolean
        get() = primaryKey != null

    val isForeignKey: Boolean
        get() = foreignKey != null

    fun get(model: Any) : Any? = property.get(model)

    fun <T: Any> get(c: Cursor) : T? {
        val columnIndex = c.getColumnIndexOrThrow(name)

        var dbValue: Any? = when(type) {
            ColumnType.BIGINT -> c.getLongOrNull(columnIndex)
            ColumnType.BOOLEAN -> c.getIntOrNull(columnIndex)
            ColumnType.INT -> c.getIntOrNull(columnIndex)
            ColumnType.REAL -> c.getDoubleOrNull(columnIndex)
            ColumnType.DATETIME, ColumnType.TIME, ColumnType.DATE -> c.getStringOrNull(columnIndex)
            else -> c.getStringOrNull(columnIndex)
        } ?: return null

        return (when(type) {
            ColumnType.BOOLEAN -> dbValue == 1
            ColumnType.DATETIME, ColumnType.TIME, ColumnType.DATE -> SimpleDateFormat(getDatePattern()).parse(dbValue as String)
            else -> dbValue
        }) as T
    }

    fun setValue(model: Any, value: Any?) = property.set(model, value)
    fun setValue(model: Any, c: Cursor) = setValue(model, get<Any>(c))

    fun getDatePattern() : String? = when(this.type) {
        ColumnType.DATETIME -> me.gentielezaj.sqldroid.common.DatePatterns.dateTime
        ColumnType.DATE -> me.gentielezaj.sqldroid.common.DatePatterns.date
        ColumnType.TIME -> me.gentielezaj.sqldroid.common.DatePatterns.time
        else -> null
    }

    companion object {
        fun create(property: KProperty1<out Any, Any?>) : ColumnInfo? {
            val column = property.findAnnotation<Column>()
            if(column == null) return null

            val primaryKey = property.findAnnotation<PrimaryKey>()
            val columnType = getColumnType(property.returnType, column.type)

            return ColumnInfo(
                name = column.name.valueOrDefault(property.name),
                type = columnType,
                nullable = column.nullable && property.returnType.isMarkedNullable && primaryKey == null,
                length = column.length,
                default = column.default.valueOrNull()?.to(property.returnType),
                readOnly = column.computed,
                property = property as KMutableProperty1<Any, Any?>,
                primaryKey = if(primaryKey != null) PrimaryKeyInfo(primaryKey.autoincrement) else null,
                foreignKey = ForeignKeyInfo.create(property)
            )
        }

        fun getColumnType(type: KType, columnType: ColumnType = ColumnType.DEFAULT) : ColumnType {
            if(columnType != ColumnType.DEFAULT) return columnType
            return when(type) {
                Int::class.createType(nullable = type.isMarkedNullable)
                    -> ColumnType.INT
                Float::class.createType(nullable = type.isMarkedNullable) -> ColumnType.REAL
                Date::class.createType(nullable = type.isMarkedNullable) -> ColumnType.DATETIME
                Boolean::class.createType(nullable = type.isMarkedNullable) -> ColumnType.BOOLEAN
                Long::class.createType(nullable = type.isMarkedNullable) -> ColumnType.BIGINT
                String::class.createType(nullable = type.isMarkedNullable) -> ColumnType.NVARCHAR
                else -> throw UnsuportedColumnTypeException()
            }
        }
    }

}

enum class ColumnType {
    INT,
    BIGINT,
    NVARCHAR,
    BOOLEAN,
    DATE,
    TEXT,
    TIME,
    DATETIME,
    REAL,
    DEFAULT,
}