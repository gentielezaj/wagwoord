package me.gentielezaj.sqldroid

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import me.gentielezaj.sqldroid.migrations.Migration
import me.gentielezaj.sqldroid.migrations.MigrationQuery

private fun getVersion(version: Int?, migrations: Iterable<Migration>? = null): Int {
    if (version != null) return version;
    if (migrations == null) return 1
    var dbVersion = 1
    for(migration in migrations.filterNotNull()) {
        if(migration.version > dbVersion) dbVersion = migration.version
    }
    return dbVersion
}

private fun log(string: String): Unit {
    android.util.Log.d("exeption", string)
}
private fun logExeption(e: Exception, string: String): Unit {
    android.util.Log.d("exeption", e.message + string)
}


open class SqlDroidConfiguration(
    val context: Context,
    databaseName: String,
    private val migrations: Iterable<Migration>? = null,
    var version: Int,
    val log: (String) -> Unit,
    val logException: (Exception, String) -> Unit
) : SQLiteOpenHelper(context, databaseName, null, version) {

    constructor(context: Context, databaseName: String) : this(
        context,
        databaseName,
        null,
        1,
        ::log,
        ::logExeption
    )

    constructor(
        context: Context,
        databaseName: String,
        migrations: Iterable<Migration>,
        log: (String) -> Unit,
        logException: (Exception, String) -> Unit
    ) : this(
        context,
        databaseName,
        migrations,
        getVersion(null, migrations),
        log,
        logException
    )

    constructor(context: Context, databaseName: String, migrations: Iterable<Migration>) : this(
        context,
        databaseName,
        migrations,
        getVersion(null, migrations),
        ::log,
        ::logExeption
    )

    // region override
    override fun onCreate(db: SQLiteDatabase) {
        onUpgrade(db, 0, version)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        if (migrations == null) return;
        val migrationQuery = MigrationQuery(db)
        for (migration in migrations.sortedWith(compareBy(Migration::version, Migration::order))) {
            if (migration.version in (oldVersion + 1)..newVersion) {
                migration.onUpgrade(migrationQuery)
            }
        }
    }

    override fun onDowngrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        if (migrations == null) return;
        val migrationQuery = MigrationQuery(db)
        for (migration in migrations.sortedWith(
            compareByDescending(Migration::version).thenByDescending(
                Migration::order
            )
        )) {
            if (migration.version in (newVersion + 1)..oldVersion) {
                migration.onDowngrade(migrationQuery)
            }
        }
    }
    // endregion

    //region session
    fun <T> write(statement: (Database) -> T): T {
        val db = Database(writableDatabase)
        try {
            return statement.invoke(db)
        } catch (e : Exception) {
            throw e;
        } finally {
            db.close()
        }
    }

    fun <T> read(statement: (Database) -> T): T {
        val db = Database(readableDatabase)
        try {
            return statement.invoke(db)
        } catch (e : Exception) {
            throw e;
        } finally {
            db.close()
        }
    }

//endregion
}