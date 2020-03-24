package me.gentielezaj.sqldroid.executions

import me.gentielezaj.sqldroid.init.TestDatabase
import me.gentielezaj.sqldroid.model.City
import me.gentielezaj.sqldroid.query.QueryBuilder
import me.gentielezaj.sqldroid.query.Restriction
import me.gentielezaj.sqldroid.query.Restriction.Companion.contains
import me.gentielezaj.sqldroid.query.Restriction.Companion.gt
import me.gentielezaj.sqldroid.query.Restriction.Companion.notNull
import org.junit.Assert
import org.junit.Test

class QueryBuilderTest {
    val db = TestDatabase()
    @Test
    fun InsetPerson() {
        var id = 0
        try {
            val list = db.read {
                it.getQuery<City>().toList()
            }

            id = list.size
        } catch (e: Exception) {
            throw e;
        }

        Assert.assertTrue(id > 0)
    }


    @Test
    fun selectOne() {
        var id: String? = ""
        try {
            id = db.read {
                it.getQuery<City>().select(City::name).singleOrNull()
            }
        } catch (e: Exception) {
            throw e;
        }

        Assert.assertTrue(!id.isNullOrEmpty())
    }


    @Test
    fun selectMeny() {
        var id = ""
        try {
            val result = db.read {
                it.getQuery<City>().selects(City::name, City::id).single()
            }

            id = result[City::name] as String
        } catch (e: Exception) {
            throw e;
        }

        Assert.assertTrue(!id.isNullOrEmpty())
    }
}