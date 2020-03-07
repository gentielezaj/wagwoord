package me.gentielezaj.sqldroid

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

    fun db() {

    }
}
