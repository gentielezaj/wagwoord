package me.gentielezaj.sqldroid

import me.gentielezaj.sqldroid.models.Person
import me.gentielezaj.sqldroid.models.Person1
import org.junit.Test

import org.junit.Assert.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */

class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        val format =  DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")
        assertEquals("sot dita", format.format(LocalDateTime.now()))
    }

    @Test
    fun db() {
        var s = Class2::class1
        var s1 = Person1::person
        var sw = s.name
        assertTrue(s != null)
    }
}

class Class1 {
    var id:Int = 0
    var ss:String = ""
}

class Class2 {
    var class1: Class1? = null
}
