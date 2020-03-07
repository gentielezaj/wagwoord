package me.gentielezaj.sqldroid.common

import java.lang.reflect.Type
import kotlin.reflect.KClass

fun getClassFormGenericType(type: Type) : KClass<*> {
    val className = type.typeName.replace(".+<".toRegex(), "").replace(">", "")
    return Class.forName(className).kotlin
}