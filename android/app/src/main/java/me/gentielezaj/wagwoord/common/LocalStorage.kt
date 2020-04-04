package me.gentielezaj.wagwoord.common

import android.content.Context

class LocalStorage(val context: Context) {

    inline fun <reified T> get(key: String, default: T): T {
        return get(context, key)?: default
    }

    inline fun <reified T> get(key: String): T? {
        val sharedPref = context.getSharedPreferences(Constants.LocalStorageKeys.SHARED_PREFERENCES, Context.MODE_PRIVATE) ?: return null

        val stringValue = sharedPref.getString(key, null)

        if(stringValue.isNullOrEmpty()) return null;

        when(T::class) {
            Int::class -> return stringValue.toIntOrNull() as? T?;
            Boolean::class -> return stringValue.toBoolean() as? T?;
            Float::class -> return stringValue.toFloatOrNull() as? T?;
        }

        return if(stringValue.startsWith("{") && stringValue.endsWith("}"))
            JSON.parse<T>(stringValue)
        else stringValue as? T
    }

    fun set(key: String, value: Any?): Boolean {
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

    inline fun remove(key: String): Boolean {
        val sharedPref = context.getSharedPreferences(Constants.LocalStorageKeys.SHARED_PREFERENCES, Context.MODE_PRIVATE) ?: return false
        with (sharedPref.edit()) {
            remove(key)
            commit()
        }

        return true;
    }

    companion object {
        inline fun <reified T> get(context: Context, key: String, default: T): T = LocalStorage(context).get<T>(key, default)

        inline fun <reified T> get(context: Context, key: String): T? = LocalStorage(context).get<T>(key);

        fun set(context: Context, key: String, value: Any?): Boolean = LocalStorage(context).set(key, value);

        inline fun remove(context: Context, key: String): Boolean = LocalStorage(context).remove(key)
    }
}



