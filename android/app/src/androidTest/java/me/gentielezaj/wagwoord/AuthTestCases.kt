package me.gentielezaj.wagwoord

import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.runBlocking
import me.gentielezaj.wagwoord.services.AuthService
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AuthTestCases : CoreTest() {

    val authService
        get() = AuthService(context)

    @Test
    fun loginDomainError() {
        val domain = "http://10.2.2.0"
        val encryptionKey = "mut010"
        localStorage.clearAll()

        var response = runBlocking { authService.login(domain, encryptionKey) }

        Assert.assertTrue(!response.success && response.errorMessage == context.getString(R.string.server_error))
    }

    @Test
    fun loginAuthError() {
        val domain = "http://10.0.2.2:4040/api"
        val encryptionKey = "mut010"
        localStorage.clearAll()

        var response = runBlocking { authService.login(domain, encryptionKey) }

        Assert.assertTrue(!response.success && response.errorMessage == context.getString(R.string.unauthorised))
    }

    @Test
    fun login() {
        val domain = "http://10.0.2.2:4040/api"
        val encryptionKey = "mut01046"
        localStorage.clearAll()

        var response = runBlocking { authService.login(domain, encryptionKey) }

        Assert.assertTrue(response.success)
    }
}