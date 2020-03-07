package me.gentielezaj.wagwoord

import android.content.Context
import me.gentielezaj.wagwoord.android.TestContext
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import org.junit.Test

import org.junit.Assert.*

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */

class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        val encryption = EncryptionService(TestContext())
        assertEquals(4, 2 + 2)
    }
}
