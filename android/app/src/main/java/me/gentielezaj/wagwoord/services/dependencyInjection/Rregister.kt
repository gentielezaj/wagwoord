package me.gentielezaj.wagwoord.services.dependencyInjection

import android.content.Context
import androidx.databinding.ViewDataBinding
import me.gentielezaj.wagwoord.fragments.addresses.AddressItemFragment
import me.gentielezaj.wagwoord.fragments.core.CoreItemFragment
import me.gentielezaj.wagwoord.fragments.core.ICoreItemFragment
import me.gentielezaj.wagwoord.fragments.creditcards.CreditcardItemFragment
import me.gentielezaj.wagwoord.fragments.passwords.PasswordItemFragment
import me.gentielezaj.wagwoord.fragments.totp.TotpItemFragment
import me.gentielezaj.wagwoord.models.entities.Address
import me.gentielezaj.wagwoord.models.entities.CreditCard
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.AuthService
import me.gentielezaj.wagwoord.services.BackgroundService
import me.gentielezaj.wagwoord.services.BaseService
import me.gentielezaj.wagwoord.services.entity.*
import kotlin.reflect.KClass


open class DIModel internal constructor(
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
    val itemFragment: KClass<out CoreItemFragment<out IEntity, out ViewDataBinding>>,
    resolver: (context: Context) -> CoreService<out IEntity>,
) : DIModel(key, service, registedServices, resolver) {
    fun <T: IEntity> entity() = entity as KClass<T>
}

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
                listOf(CoreService::class, CoreEntityService::class),
                TotpItemFragment::class
            ) { TotpService(it) },
            DIEntityModel(
                KEY_ADDRESS,
                Address::class,
                CoreEntityCountService::class,
                listOf(CoreService::class, CoreEntityService::class, CoreEntityCountService::class),
                AddressItemFragment::class
            ) { CoreEntityCountService(it, Address::class) },
            DIEntityModel(
                KEY_CREDITCARD, CreditCard::class, CoreEntityCountService::class, listOf(
                    CoreService::class, CoreEntityService::class, CoreEntityCountService::class
                ),
                CreditcardItemFragment::class
            ) { CoreEntityCountService(it, CreditCard::class) },
            DIEntityModel(
                KEY_PASSWORD,
                Password::class,
                CoreEntityCountService::class,
                listOf(CoreService::class, CoreEntityService::class, CoreEntityCountService::class),
                PasswordItemFragment::class
            ) { CoreEntityCountService(it, Password::class) },
            DIModel(
                KEY_SETTINGS,
                SettingsService::class,
                listOf(CoreService::class, CoreEntityService::class)
            ) { SettingsService(it) },
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
