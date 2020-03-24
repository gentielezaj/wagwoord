package me.gentielezaj.sqldroid.executions

import android.util.Log
import androidx.test.platform.app.InstrumentationRegistry
import me.gentielezaj.sqldroid.init.TestDatabase
import me.gentielezaj.sqldroid.model.City
import me.gentielezaj.sqldroid.model.Person
import org.junit.Assert
import org.junit.Test
import java.time.LocalDateTime

public class InsetUpdateTests {

    var db = TestDatabase(InstrumentationRegistry.getInstrumentation().targetContext)

    @Test
    fun InsetCityTable() {
        var id = 0
        try {
            //id = db.write { it.insert(City(name = "Shtoj", id = 5), false) as Int }
            id = db.write { it.save(City(name = "Ucinj" + LocalDateTime.now()), true) as Int }
        } catch (e: Exception) {
            throw e;
        }

        Assert.assertTrue(id == 2)
    }

    @Test
    fun InsetPerson() {
        var id = 0
        try {
            //id = db.write { it.insert(City(name = "Shtoj", id = 5), false) as Int }
            id = db.write { it.save(Person(name = "Ucinj1" + LocalDateTime.now(), city = City(name = "blabla1sdfsdf")), true) as Int }
            val cityId = db.write { it.save( City(name = "blablaasfasfdasf")) }
        } catch (e: Exception) {
            throw e;
        }

        Assert.assertTrue(id == 2)
    }

}