package me.gentielezaj.sqldroid.models.annotations.column

import android.database.Cursor
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.Nullable
import kotlin.reflect.KClass

open class ColumnConverter{
    open fun read(value: Any?) : Any? {
        return value;
    }

    open fun write(value: Any?) : Any? {
        return value
    }
}

@Target(AnnotationTarget.PROPERTY)
annotation class Column(
    val name: String = "",
    val type: ColumnType = ColumnType.DEFAULT,
    val nullable: Nullable = Nullable.DEFAULT,
    val length: Int = 0,
    val default: String = "",
    val computed: Boolean = false,
    val converter: KClass<out ColumnConverter> = ColumnConverter::class
)
