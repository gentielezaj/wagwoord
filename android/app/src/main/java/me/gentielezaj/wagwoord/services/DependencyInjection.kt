package me.gentielezaj.wagwoord.services

import android.app.Activity
import android.content.Context
import android.view.View
import androidx.annotation.IdRes
import androidx.fragment.app.Fragment
import com.google.gson.reflect.TypeToken
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.IIdEntity
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import kotlin.Exception
import kotlin.reflect.KClass
import kotlin.reflect.full.primaryConstructor


class DI {
    protected open class TypeLiteral<T: BaseService>(t: KClass<T>? = null) {
        val type: Type

        init {
            if(t != null ) {
                type = t.javaObjectType
            } else type =  (this.javaClass.genericSuperclass as ParameterizedType).actualTypeArguments[0]
        }

        val cl: Class<T>
            get() = type as Class<T>

        val balcklist = listOf(String::class)

        fun reflections() : Map<KClass<Any>, KClass<Any>> {
            val map= mapOf<KClass<Any>, KClass<Any>>()
            return  map;
        }

        val isGeneric: Boolean
            get() = !balcklist.map{"Data<" + it.java.name + ">"}.contains(type.toString()) // type != object : TypeLiteral<Data<String>>() {}.type
    }

    companion object {
        protected val extends = mapOf<KClass<out IEntity>, KClass<BaseService>>()

        inline fun <reified T : BaseService> resolve(context: Context) : T {
            try {
                val type: TypeLiteral<T> = object : TypeLiteral<T>() {}
                if(T::class == CoreEntityService::class && type.isGeneric) {
                    val className = type.type.typeName.replace(".+<".toRegex(), "").replace(">", "")
                    val cl = Class.forName(className).kotlin
                    if(extends.containsKey(cl)) {
                        return extends[cl]!!.primaryConstructor!!.call(context) as T
                    }
                    return T::class.java.getConstructor(Context::class.java, KClass::class.java).newInstance(context, cl)
                }
                else return T::class.java.getConstructor(Context::class.java).newInstance(context)
            } catch (e: Exception) {
                LogData(e, "Resolve repository")
                throw  e
            }
        }

        inline fun <reified T: IEntity> resolveEntity(context: Context) : CoreEntityService<T> = resolve<CoreEntityService<T>>(context)

        fun <T: IEntity> resolveEntity(context: Context, entity: KClass<T>) : CoreEntityService<T> {
            try {
                if(extends.containsKey(entity)) {
                    return extends[entity]!!.primaryConstructor!!.call(context) as CoreEntityService<T>
                }
                return CoreEntityService::class.primaryConstructor!!.call(context, entity) as CoreEntityService<T>
            } catch (e: Exception) {
                LogData(e, "Resolve repository")
                throw  e
            }
        }
    }
}

fun <T: View> Activity.bindView(@IdRes res: Int) : Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { findViewById<T>(res) }
}

inline fun <reified T: BaseService> Activity.inject() : Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolve<T>(this) }
}


inline fun <reified T: BaseService> Fragment.inject() : Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolve<T>(requireContext()) }
}

inline fun <reified T: IEntity> Fragment.injectEntityService() : Lazy<out CoreEntityService<T>> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolveEntity<T>(requireContext(), T::class) }
}