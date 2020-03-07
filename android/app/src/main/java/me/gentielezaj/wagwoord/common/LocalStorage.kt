package me.gentielezaj.wagwoord.common

import android.content.Context
import android.content.Intent
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import me.gentielezaj.wagwoord.activities.configuration.SetupActivity
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

        inline fun <reified T> set(context: Context, key: String, value: T): Boolean {

            var stringValue: String? = null
            when(T::class) {
                Int::class -> stringValue = value.toString();
                Boolean::class -> stringValue = value.toString();
                Float::class -> stringValue = value.toString();
                String::class -> stringValue = value.toString();
                else -> stringValue = JSON.stringify(value)
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


