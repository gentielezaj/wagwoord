package me.gentielezaj.wagwoord.common

import android.content.Context
import android.content.SharedPreferences

class LocalStorage(val context: Context) {

    val sharedPref: SharedPreferences
        get() =  context.getSharedPreferences(Constants.LocalStorageKeys.SHARED_PREFERENCES, Context.MODE_PRIVATE)


    inline fun <reified T> get(key: String, default: T): T {
        return get(context, key)?: default
    }

    inline fun <reified T> get(key: String): T? {
        try {
            if(sharedPref == null) return null
            val stringValue = sharedPref.getString(key, null)

            if(stringValue.isNullOrEmpty()) return null;

            when(T::class) {
                Int::class -> return stringValue.toIntOrNull() as? T?;
                Boolean::class -> return stringValue.toBoolean() as? T?;
                Float::class -> return stringValue.toFloatOrNull() as? T?;
                ServerStatus::class -> {
                    val trim = stringValue.trim('"')
                    return  ServerStatus.values().find { it.name == trim } as T
                }
            }

            return if(stringValue.startsWith("{") && stringValue.endsWith("}"))
                JSON.parse<T>(stringValue)
            else stringValue as? T
        } catch (e: Exception) {
            throw e
        }
    }

    fun setOrRemove(key: String, value: Any?) : Boolean =
        if(value == null) remove(key) else set(key, value);

    fun set(key: String, value: Any): Boolean {
        var stringValue = when(value) {
            is Int -> value.toString();
            is Boolean -> value.toString();
            is Float -> value.toString();
            is String -> value.toString();
            else -> JSON.stringify(value)
        }

        if(sharedPref == null) return false;

        commit { it.putString(key, stringValue) }
        return true;
    }

    fun remove(key: String): Boolean {
        if(sharedPref == null) return false
        commit { it.remove(key) }

        return true;
    }

    fun clearAll() = commit { it.clear() }

    private fun commit(commitFn : (SharedPreferences.Editor) -> Unit) : Unit {
        with(sharedPref.edit()) {
            commitFn(this)
            this.commit()
        }
    }

    companion object {
        inline fun <reified T> get(context: Context, key: String, default: T): T = LocalStorage(context).get<T>(key, default)

        inline fun <reified T> get(context: Context, key: String): T? = LocalStorage(context).get<T>(key);

        fun set(context: Context, key: String, value: Any?): Boolean = LocalStorage(context).setOrRemove(key, value);

        inline fun remove(context: Context, key: String): Boolean = LocalStorage(context).remove(key)
    }
}



