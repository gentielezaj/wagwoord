package me.gentielezaj.wagwoord.database

import android.content.Context
import me.gentielezaj.sqldroid.SqlDroidConfiguration
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.database.migrations.migrationList

class Database(context: Context) : SqlDroidConfiguration(context, "wagwoord.sqlite", migrationList, ::LogData, ::LogData) {
    fun version() = this.version
}