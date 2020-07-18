package me.gentielezaj.wagwoord.models.annotations

import me.gentielezaj.wagwoord.common.empty
import java.security.KeyPair
import kotlin.reflect.KProperty
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

enum class ListDataTypes {
    Subject,
    Description,
    ExpandPrimary,
    ExpandSecondary,
    None
}

annotation class ListData(val dataFor: ListDataTypes, val prefix:String = "", val sufix: String = "", val order:Int = 0, val showOnCopyList: Boolean = false, val searchable: Boolean = false)

fun getListDataText(item: Any, type: ListDataTypes) : String {
    val prop = item.javaClass.kotlin.memberProperties.find { it.findAnnotation<ListData>()?.dataFor == type }
    val value = prop?.get(item)?.toString() ?: String.empty
    val prefix = prop?.findAnnotation<ListData>()?.prefix?: String.empty
    return prefix + value
}

private class ListDataProperties(val property: KProperty1<out Any, Any?>, val listData: ListData, val value: String)

fun getListDataText(item: Any) : Map<ListDataTypes, String> {
    var map = mutableMapOf<ListDataTypes, MutableList<ListDataProperties>>()
    for(property in item.javaClass.kotlin.memberProperties) {
        var listData = property.findAnnotation<ListData>()?:continue

        var ldp = ListDataProperties(property, listData, property.get(item)?.toString() ?: String.empty)
        if(map.containsKey(listData.dataFor)) map[listData.dataFor]!!.add(ldp)
        else map[listData.dataFor] = mutableListOf<ListDataProperties>(ldp)

        map[listData.dataFor]!!.sortBy { it.listData.order }
    }

    return map.map{ (key, value) ->
        key to toString(value)
    }.toMap()
}

private fun toString(propertyData: MutableList<ListDataProperties>): String {
    propertyData.sortBy { it.listData.order }
    var result = mutableListOf<String>()
    for(property in propertyData) {
        result.add(property.listData.prefix + property.value + property.listData.sufix)
    }

    return result.joinToString(" ")
}