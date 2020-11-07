package me.gentielezaj.wagwoord.services.dependencyInjection

import android.content.Context
import me.gentielezaj.wagwoord.models.entities.Address
import me.gentielezaj.wagwoord.models.entities.CreditCard
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.models.entities.settings.Settings
import me.gentielezaj.wagwoord.services.AuthService
import me.gentielezaj.wagwoord.services.BackgroundService
import me.gentielezaj.wagwoord.services.BaseService
import me.gentielezaj.wagwoord.services.entity.*
import kotlin.reflect.KClass


public open class DIModel internal constructor(
    val key: String,
    val service: KClass<out BaseService>,
    val registedServices: List<KClass<out BaseService>>,
    val resolver: (context: Context) -> BaseService
)

class DIEntityModel internal constructor(
    key: String,
    val entity: KClass<out IEntity>,
    service: KClass<out CoreService<out IEntity>>,
    registedServices: List<KClass<out CoreService<out IEntity>>>,
    resolver: (context: Context) -> CoreService<out IEntity>
) : DIModel(key, service, registedServices, resolver)

class DIRegistry {
    companion object {
        const val KEY_TOTP = "totp"
        const val KEY_ADDRESS = "address"
        const val KEY_CREDITCARD = "creditcard"
        const val KEY_PASSWORD = "password"
        const val KEY_SETTINGS = "settings"
        const val KEY_AUTH = "auth"
        const val KEY_BACKGROUND = "background"


        val list = listOf(
            DIEntityModel(
                KEY_TOTP,
                Totp::class,
                TotpService::class,
                listOf(CoreService::class, CoreEntityService::class)
            ) { TotpService(it) },
            DIEntityModel(
                KEY_ADDRESS,
                Address::class,
                CoreEntityCountService::class,
                listOf(CoreService::class, CoreEntityService::class, CoreEntityCountService::class)
            ) { CoreEntityCountService(it, Address::class) },
            DIEntityModel(
                KEY_CREDITCARD, CreditCard::class, CoreEntityCountService::class, listOf(
                    CoreService::class, CoreEntityService::class, CoreEntityCountService::class
                )
            ) { CoreEntityCountService(it, CreditCard::class) },
            DIEntityModel(
                KEY_PASSWORD,
                Password::class,
                CoreEntityCountService::class,
                listOf(CoreService::class, CoreEntityService::class, CoreEntityCountService::class)
            ) { CoreEntityCountService(it, Password::class) },
            DIEntityModel(
                KEY_SETTINGS,
                Settings::class,
                SettingsService::class,
                listOf(CoreService::class, CoreEntityService::class)
            ) { CoreEntityService(it, Settings::class) },
            DIModel(
                KEY_AUTH,
                AuthService::class,
                listOf(AuthService::class, BaseService::class)
            ) { AuthService(it) },
            DIModel(
                KEY_BACKGROUND,
                BackgroundService::class,
                listOf(BackgroundService::class, BaseService::class)
            ) { BackgroundService(it) },
        )
    }
}
