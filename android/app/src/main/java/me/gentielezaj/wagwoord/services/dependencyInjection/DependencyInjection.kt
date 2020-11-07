package me.gentielezaj.wagwoord.services.dependencyInjection

import android.app.Activity
import android.content.Context
import android.view.View
import androidx.annotation.IdRes
import androidx.fragment.app.Fragment
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.models.entities.Address
import me.gentielezaj.wagwoord.models.entities.CreditCard
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.models.entities.settings.Settings
import me.gentielezaj.wagwoord.services.BaseService
import me.gentielezaj.wagwoord.services.entity.*
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import kotlin.reflect.KClass
import kotlin.reflect.full.primaryConstructor


@Suppress("UNCHECKED_CAST")
class DI {
    open class TypeLiteral<T : BaseService>(t: KClass<T>? = null) {
        val type: Type = t?.javaObjectType
            ?: (this.javaClass.genericSuperclass as ParameterizedType).actualTypeArguments[0]

        @Suppress("UNCHECKED_CAST")
        val cl: Class<T>
            get() = type as Class<T>

        private val blacklist = listOf(String::class)

        fun reflections(): Map<KClass<Any>, KClass<Any>> {
            return mapOf()
        }

        val isGeneric: Boolean
            get() = !blacklist.map { "Data<" + it.java.name + ">" }
                .contains(type.toString()) // type != object : TypeLiteral<Data<String>>() {}.type
    }

    @Suppress("PROTECTED_CALL_FROM_PUBLIC_INLINE")
    companion object {
        val registry = DIRegistry.list;
        inline fun <reified T : BaseService> resolve(context: Context): T {
            return try {
                val type: TypeLiteral<T> = object : TypeLiteral<T>() {}
                if (type.type.typeName.contains('<') && type.type.typeName.contains('>')) {
                    val className = type.type.typeName.replace(".+<".toRegex(), "").replace(">", "")
                    val cl = Class.forName(className).kotlin as KClass<out IEntity>
                    resolveEntity(context, cl) as T
                } else registry.first {it.service == T::class}.resolver(context) as T
            } catch (e: Exception) {
                LogData(e, "Resolve repository")
                throw  e
            }
        }

        fun <T : BaseService> resolve(context: Context, key: String): T
                = registry.first {it.key == key}.resolver(context) as T

        inline fun <reified T : IEntity> resolveEntity(context: Context): CoreEntityService<T> =
            resolve(context)

        fun <T : IEntity> resolveEntity(context: Context, entity: KClass<T>): CoreEntityService<T>
            = registry.first {it is DIEntityModel && it.entity == entity}.resolver(context) as CoreEntityService<T>
    }
}

fun <T : View> Activity.bindView(@IdRes res: Int): Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { findViewById(res)!! }
}

inline fun <reified T : BaseService> Activity.inject(): Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolve(this) }
}


inline fun <reified T : BaseService> Fragment.inject(): Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolve(requireContext()) }
}

inline fun <reified T : IEntity> Fragment.injectEntityService(): Lazy<CoreEntityService<T>> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolveEntity(requireContext(), T::class) }
}

fun <T : IEntity> Context.injectEntityService(entity: KClass<T>): Lazy<CoreEntityService<T>> {
    @Suppress("UNCHECKED_CAST")
    return lazy {
        DI.resolveEntity(this, entity)
    }
}