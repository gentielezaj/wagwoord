package me.gentielezaj.wagwoord.common

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlin.reflect.KClass

class LocalStorage {
    companion object {
        inline fun <reified T> get(context: Context, key: String, default: T): T {
            return get(context, key)?: default
        }

        inline fun <reified T> get(context: Context, key: String): T? {
            val sharedPref = context.getSharedPreferences(Constants.LocalStorageKeys.SHARED_PREFERENCES, Context.MODE_PRIVATE) ?: return null

            val stringValue = sharedPref.getString(key, null)

            if(stringValue.isNullOrEmpty()) return null;

            when(T::class) {
                Int::class -> return stringValue.toIntOrNull() as? T?;
                Boolean::class -> return stringValue.toBoolean() as? T?;
                Float::class -> return stringValue.toFloatOrNull() as? T?;
            }

            if(stringValue.startsWith("{") && stringValue.endsWith("}"))
                return JSON.parse<T>(stringValue)
            else return  stringValue as? T
        }

        fun set(context: Context, key: String, value: Any?): Boolean {
            if(value == null) return true;

            var stringValue = when(value) {
                is Int -> value.toString();
                is Boolean -> value.toString();
                is Float -> value.toString();
                is String -> value.toString();
                else -> JSON.stringify(value)
            }

            val sharedPref = context.getSharedPreferences(Constants.LocalStorageKeys.SHARED_PREFERENCES, Context.MODE_PRIVATE) ?: return false
            with (sharedPref.edit()) {
                putString(key, stringValue)
                commit()
            }

            return true;
        }

        inline fun remove(context: Context, key: String): Boolean {
            val sharedPref = context.getSharedPreferences(Constants.LocalStorageKeys.SHARED_PREFERENCES, Context.MODE_PRIVATE) ?: return false
            with (sharedPref.edit()) {
                remove(key)
                commit()
            }

            return true;
        }
    }
}

class JSON {
    companion object {
        inline fun <reified T> parse(json: String): T? {
            return Gson().fromJson<T>(json, object: TypeToken<T>() {}.type)
        }

        inline fun <T> stringify(model: T): String {
            return Gson().toJson(model);
        }

        inline fun <reified T> getClass() : KClass<*> {
            return T::class
        }
    }
}


