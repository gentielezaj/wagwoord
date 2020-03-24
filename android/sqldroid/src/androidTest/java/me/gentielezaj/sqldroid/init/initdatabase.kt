package me.gentielezaj.sqldroid.init

import android.content.Context
import androidx.test.platform.app.InstrumentationRegistry
import me.gentielezaj.sqldroid.SqlDroidConfiguration

public class TestDatabase(context: Context) : SqlDroidConfiguration(context, "testDatabase", listOf(MigrationTest(), SecendMigrationTest())) {
    constructor() : this(InstrumentationRegistry.getInstrumentation().targetContext)
}