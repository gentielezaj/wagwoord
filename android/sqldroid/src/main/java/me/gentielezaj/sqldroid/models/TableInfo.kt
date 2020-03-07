package me.gentielezaj.sqldroid.models

import me.gentielezaj.sqldroid.common.valueOrDefault
import me.gentielezaj.sqldroid.exceptions.NoPrimaryKeyException
import me.gentielezaj.sqldroid.exceptions.TableNotValidException
import me.gentielezaj.sqldroid.models.annotations.table.Table
import kotlin.reflect.KClass
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

data class TableInfo(val name: String,
                     val columns: Collection<ColumnInfo>,
                     val uniques: Collection<UniqueKeyInfo>?,
                     val clazz: KClass<*>,
                     val foreignList: Collection<ForeignListInfo>?
) {

    val primaryKey: ColumnInfo
        get() = columns.first { it.isPrimaryKey }

    val foreignKeys: Collection<ColumnInfo>
        get() = columns.filter { it.isForeignKey }

    companion object {
        fun create(clazz: KClass<*>) : TableInfo {
            val table = clazz.findAnnotation<Table>()
            if(table == null) throw TableNotValidException()

            val t = TableInfo(
                clazz = clazz,
                name = table.name.valueOrDefault(clazz.simpleName!!),
                columns = clazz.memberProperties.mapNotNull { ColumnInfo.create(it) },
                uniques = UniqueKeyInfo.create(clazz),
                foreignList = ForeignListInfo.create(clazz)
            )

            if(t.columns.count { it.isPrimaryKey } != 1) throw NoPrimaryKeyException()

            return t
        }
    }
}