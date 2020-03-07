package me.gentielezaj.sqldroid.init

import me.gentielezaj.sqldroid.migrations.Migration
import me.gentielezaj.sqldroid.migrations.MigrationQuery
import me.gentielezaj.sqldroid.model.City
import me.gentielezaj.sqldroid.model.Person

class MigrationTest : Migration(1) {
    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(City::class)
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(City::class)
    }
}

class SecendMigrationTest : Migration(2) {
    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(Person::class)
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(Person::class)
    }
}