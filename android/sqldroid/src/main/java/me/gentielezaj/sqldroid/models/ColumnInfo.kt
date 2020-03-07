package me.gentielezaj.sqldroid.models

import androidx.annotation.Nullable
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.common.valueOrDefault
import me.gentielezaj.sqldroid.common.valueOrNull
import me.gentielezaj.sqldroid.exceptions.UnsuportedColumnTypeException
import me.gentielezaj.sqldroid.models.annotations.column.ForeignKey
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
                      val property: KMutableProperty1<Any, Any>,
                      val primaryKey: PrimaryKeyInfo?,
                      val foreignKey: ForeignKeyInfo?) {

    val isAutoIncrement: Boolean
        get() = isPrimaryKey && type == ColumnType.INT && primaryKey?.autoincrement?: false

    val isPrimaryKey: Boolean
        get() = primaryKey != null

    val isForeignKey: Boolean
        get() = foreignKey != null

    fun get(model: Any) : Any? = property.get(model)

    fun setValue(model: Any, value: Any) = property.set(model, value)

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
                property = property as KMutableProperty1<Any, Any>,
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