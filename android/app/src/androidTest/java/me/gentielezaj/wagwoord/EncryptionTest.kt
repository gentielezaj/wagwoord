package me.gentielezaj.wagwoord

import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.runBlocking
import me.gentielezaj.wagwoord.services.AuthService
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith


@RunWith(AndroidJUnit4::class)
class EncryptionTest : CoreTest() {

    private val encryptionService = EncryptionService(context)

    @Test
    fun encrypt() {
        val text = "Mut01047"
        val textEncrypted = "U2FsdGVkX1+aVaPGNcsFTmzt9wRKLoMuToQp6fG/ilA="
        val encryptionKey = "mut01046"

        encryptionService.encryptionKey = encryptionKey;
        var encryptedText = encryptionService.encrypt(text)

        var dec = encryptionService.decrypt(encryptedText)

        Assert.assertEquals(text, dec)
    }

    @Test
    fun decrypt() {
        val textEncrypted = "Mut01047"
        val text = "U2FsdGVkX1+aVaPGNcsFTmzt9wRKLoMuToQp6fG/ilA="
        val encryptionKey = "mut01046"

        encryptionService.encryptionKey = encryptionKey;
        var encryptedText = encryptionService.decrypt(text)

        Assert.assertEquals(textEncrypted, encryptedText)
    }
}