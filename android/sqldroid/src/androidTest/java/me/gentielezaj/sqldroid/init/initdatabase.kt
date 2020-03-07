package me.gentielezaj.sqldroid.init

import android.content.Context
import me.gentielezaj.sqldroid.SqlDroidConfiguration

public class TestDatabase(context: Context) : SqlDroidConfiguration(context, "testDatabase", listOf(MigrationTest(), SecendMigrationTest()))