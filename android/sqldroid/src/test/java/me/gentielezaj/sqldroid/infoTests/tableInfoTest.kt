package me.gentielezaj.sqldroid.infoTests

import me.gentielezaj.sqldroid.models.City
import me.gentielezaj.sqldroid.models.TableInfo
import org.junit.Assert
import org.junit.Test

class TableInfoTest {
    @Test
    fun createCityTableInfo() {
        var tableInfo = TableInfo.create(City::class)
        Assert.assertTrue(tableInfo?.primaryKey != null)
    }
}