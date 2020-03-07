package me.gentielezaj.wagwoord.database.migrations

import me.gentielezaj.sqldroid.migrations.Migration
import me.gentielezaj.sqldroid.migrations.MigrationQuery
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp

class FirstMigration : Migration(1) {
    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(Totp::class)
        query.createTable(Password::class)
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(Totp::class)
        query.createTable(Password::class)
    }
}