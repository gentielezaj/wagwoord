package me.gentielezaj.wagwoord.models.annotations

import me.gentielezaj.wagwoord.common.empty
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

enum class ListDataTypes {
    Subject,
    Description,
    ExpandPrimary,
    ExpandSecondary
}

annotation class ListData(val dataFor: ListDataTypes, val prefix:String = "")

fun getListDataText(item: Any, type: ListDataTypes) : String {
    val prop = item.javaClass.kotlin.memberProperties.find { it.findAnnotation<ListData>()?.dataFor == type }
    val value = prop?.get(item)?.toString() ?: String.empty
    val prefix = prop?.findAnnotation<ListData>()?.prefix?: String.empty
    return prefix + value
}