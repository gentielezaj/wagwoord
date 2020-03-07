package me.gentielezaj.sqldroid.migrations

import android.database.sqlite.SQLiteDatabase
import me.gentielezaj.sqldroid.models.TableInfo
import kotlin.reflect.KClass

class MigrationQuery internal constructor(val db: SQLiteDatabase) {
    private val resolver = MigrationResolver()

    // region table

    private fun tableInfo(clazzs: Array<out KClass<*>>) : List<TableInfo> {
        return clazzs.map{ TableInfo.create(it)!!  }
    }

    fun createTable(vararg clazzs: KClass<*>) = execute(resolver.createTable(tableInfo(clazzs), false))
    fun createTableIfNotExists(vararg clazzs: KClass<*>) = execute(resolver.createTable(tableInfo(clazzs), false))
    fun dropTable(vararg clazzs: KClass<*>) = execute(resolver.dropTable(tableInfo(clazzs), false))
    fun dropTableIfExists(vararg clazzs: KClass<*>) = execute(resolver.dropTable(tableInfo(clazzs), true))

    fun renameTable(tableName: String, newName: String) = execute(resolver.renameTable(tableName, newName))
    // end region

    // region execute
    fun execute(sql: String) {
        db.execSQL(sql)
    }
    // endregion
}