package me.gentielezaj.wagwoord

import androidx.test.ext.junit.runners.AndroidJUnit4
import me.gentielezaj.wagwoord.models.entities.Address
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount
import me.gentielezaj.wagwoord.services.AuthService
import me.gentielezaj.wagwoord.services.dependencyInjection.DI
import me.gentielezaj.wagwoord.services.dependencyInjection.DIRegistry
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.entity.TotpService
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class DependencyInjectionTest  : CoreTest() {

    @Test
    fun resolveKey() {
       val service = DI.resolve<AuthService>(context, DIRegistry.KEY_AUTH)
        Assert.assertNotNull(service)
    }

    @Test
    fun resolveEntityService() {
        val service = DI.resolveEntity<Totp>(context)
        Assert.assertTrue(service is TotpService)
    }

    @Test
    fun resolveEntityServiceC() {
        val service = DI.resolveEntity<Password>(context)
        Assert.assertNotNull(service)
    }

    @Test
    fun resolveBase() {
        val service = DI.resolve<AuthService>(context)
        Assert.assertNotNull(service)
    }

    @Test
    fun resolve() {
        val service = DI.resolve<CoreEntityService<Address>>(context)
        Assert.assertNotNull(service)
    }
}