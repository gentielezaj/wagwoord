package me.gentielezaj.wagwoord.common

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlin.reflect.KClass


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