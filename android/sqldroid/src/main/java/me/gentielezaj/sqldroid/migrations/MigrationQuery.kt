package me.gentielezaj.sqldroid.migrations

import android.database.sqlite.SQLiteDatabase
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1

class MigrationQuery internal constructor(val db: SQLiteDatabase) {
    private val resolver = MigrationResolver()

    // region table

    private fun <T: Any> columnInfo(clazzs: Set<KProperty1<T, Any?>>) : List<ColumnInfo> {
        return clazzs.map{ ColumnInfo.create(it)!!  }
    }

    fun <T: Any> createTable(clazzs: KClass<T>, properties: Set<KProperty1<T, Any?>>) = execute(resolver.createTable(TableInfo.create(clazzs), false, columnInfo(properties)))
    fun <T:Any> createTableIfNotExists(clazzs: KClass<T>, properties: Set<KProperty1<T, Any?>>) = execute(resolver.createTable(TableInfo.create(clazzs), false, columnInfo(properties)))
    fun dropTable(clazzs: KClass<*>) = execute(resolver.dropTable(TableInfo.create(clazzs), false))
    fun dropTableIfExists(clazzs: KClass<*>) = execute(resolver.dropTable(TableInfo.create(clazzs), true))

    fun renameTable(tableName: String, newName: String) = execute(resolver.renameTable(tableName, newName))
    // end region

    // region execute
    fun execute(sql: String) {
        db.execSQL(sql)
    }
    // endregion
}