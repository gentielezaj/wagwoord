package me.gentielezaj.wagwoord.services

import android.app.Activity
import android.content.Context
import android.view.View
import androidx.annotation.IdRes
import com.google.gson.reflect.TypeToken
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.services.repositories.CoreRepository
import me.gentielezaj.wagwoord.services.repositories.TotpRepository
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import kotlin.Exception
import kotlin.reflect.KClass


class DI {
    protected open class TypeLiteral<T> {
        val type: Type
            get() = (this.javaClass.getGenericSuperclass() as ParameterizedType).getActualTypeArguments()[0]

        val cl: Class<T>
            get() = type as Class<T>

        val balcklist = listOf(String::class)

        val isGeneric: Boolean
            get() = !balcklist.map{"Data<" + it.java.name + ">"}.contains(type.toString()) // type != object : TypeLiteral<Data<String>>() {}.type
    }

    companion object {
        inline fun <reified T> resolve(context: Context) : T {
            try {
                val type: TypeLiteral<T> = object : TypeLiteral<T>() {}
                println(type.type)
                if(T::class == CoreRepository::class && type.isGeneric) {
                    val className = type.type.typeName.replace(".+<".toRegex(), "").replace(">", "")
                    val cl = Class.forName(className)
                    return T::class.java.getConstructor(Context::class.java, Class::class.java).newInstance(context, cl)
                }
                else return T::class.java.getConstructor(Context::class.java).newInstance(context)
            } catch (e: Exception) {
                LogData(e, "Resolve repository")
                throw  e
            }
        }
    }
}

fun <T: View> Activity.bindView(@IdRes res: Int) : Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { findViewById(res) as T }
}

inline fun <reified T> Activity.inject() : Lazy<T> {
    @Suppress("UNCHECKED_CAST")
    return lazy { DI.resolve<T>(this) }
}