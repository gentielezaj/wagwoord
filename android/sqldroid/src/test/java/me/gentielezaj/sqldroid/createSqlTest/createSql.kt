package me.gentielezaj.sqldroid.createSqlTest

import me.gentielezaj.sqldroid.migrations.Migration
import me.gentielezaj.sqldroid.migrations.MigrationResolver
import me.gentielezaj.sqldroid.models.City
import me.gentielezaj.sqldroid.models.Person
import me.gentielezaj.sqldroid.models.TableInfo
import org.junit.Assert
import org.junit.Test
import java.lang.Exception

class CreteSqlString {
    @Test
    fun createCitySqlString() {
        var tableInfo = MigrationResolver.createTable(City::class)
        Assert.assertTrue(tableInfo == "fgdfg")
    }
    @Test
    fun createPersonSqlString() {
        var tableInfo:String
        try {
            tableInfo = MigrationResolver.createTable(Person::class)
            Assert.assertTrue(tableInfo == "fgdfg")
        } catch (e :Exception) {
            throw  e
        }
        Assert.assertTrue(tableInfo == "fgdfg")
    }
}