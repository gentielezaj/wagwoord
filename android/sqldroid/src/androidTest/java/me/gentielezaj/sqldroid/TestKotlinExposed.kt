package me.gentielezaj.sqldroid
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.transactions.transactionManager
import org.junit.Assert
import org.junit.Test
import java.lang.Exception
import java.sql.Connection
import java.sql.Driver
import java.sql.DriverManager

object Users : IntIdTable("") {
    val name = varchar("name", 50).index()
    val age = integer("age")
}

class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(Users)
    var name by Users.name
    var age by Users.age
}

object Cities : IntIdTable("City") {
    var name = varchar("name", 50000)
}

class City(id: EntityID<Int>) :  IntEntity(id) {
    companion object : IntEntityClass<City>(Cities)
    var name by Cities.name
}

class KTE {
    @Test
    fun createaConnection() {
        var id = 0
        try {
            val jdbcUrl = "jdbc:sqldroid:/data/data/me.gentielezaj.sqldroid.test/databases/testDatabase";

            DriverManager.registerDriver(Class.forName("org.sqldroid.SQLDroidDriver").newInstance() as Driver)
            var connection = DriverManager.getConnection(jdbcUrl);

            var co = org.jetbrains.exposed.sql.Database.connect(jdbcUrl, "org.sqldroid.SQLDroidDriver")
            var t = co.transactionManager.newTransaction();
            transaction(Connection.TRANSACTION_READ_COMMITTED, 1) {
                //SchemaUtils.create (Users)
                id = City.all().count()
            }
        } catch (e : Exception) {
            throw  e;
        }

        Assert.assertTrue(id > 0)
    }
}
