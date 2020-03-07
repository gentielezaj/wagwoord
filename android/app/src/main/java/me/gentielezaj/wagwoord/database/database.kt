package me.gentielezaj.wagwoord.database

import android.content.Context
import me.gentielezaj.sqldroid.SqlDroidConfiguration
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.database.migrations.FirstMigration

class Database(context: Context) : SqlDroidConfiguration(context, "wagwoord.sqlite", listOf(FirstMigration()), ::LogData, ::LogData)