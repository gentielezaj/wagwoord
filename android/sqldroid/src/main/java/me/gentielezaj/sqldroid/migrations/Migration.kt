package me.gentielezaj.sqldroid.migrations

abstract class Migration (val version: Int, val order: Int = 0) {
    abstract fun onUpgrade(query: MigrationQuery)
    abstract fun onDowngrade(query: MigrationQuery)
}