package me.gentielezaj.sqldroid.query

import me.gentielezaj.sqldroid.models.City
import me.gentielezaj.sqldroid.models.ForeignKeyInfo.Companion.create
import me.gentielezaj.sqldroid.models.Person
import me.gentielezaj.sqldroid.query.QueryBuilder.Companion.create
import me.gentielezaj.sqldroid.query.Restriction.Companion.eq
import org.junit.Assert
import org.junit.Test

public class CreateQuery {
    @Test
    fun selectAllFromQuery() {
        var query = QueryBuilder.create<City>()
        var sql = query.toString();

        Assert.assertTrue(sql == "SELECT \"City\".\"name\", \"City\".\"id\" FROM \"City\"")
    }
    @Test
    fun selectNameFromQuery() {
        var query = QueryBuilder.create<City>(City::name)
        var sql = query.toString();

        Assert.assertTrue(sql == "SELECT \"City\".\"name\" FROM \"City\"")
    }

    @Test
    fun order() {
        var where = Where.OR((City::name eq "bla bla"), (City::name eq "bubu"))
        var query = ((QueryBuilder.create<City>(City::name) asc City::name) desc City::id).where(where)
        var order = Order.Asc(City::id)
        query.orderBy(order).select(City::name);
        Assert.assertTrue(query.toString().isNullOrEmpty())
    }

    @Test
    fun where() {
    }
}