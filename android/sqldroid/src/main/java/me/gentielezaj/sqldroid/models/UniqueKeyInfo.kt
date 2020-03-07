package me.gentielezaj.sqldroid.models

import me.gentielezaj.sqldroid.common.valueOrDefault
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import kotlin.reflect.KClass
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

data class UniqueKeyInfo(val name: String, val columns: Collection<ColumnInfo>) {
    companion object {
        fun create(clazz: KClass<*>) : List<UniqueKeyInfo>? {
            var res = mutableMapOf<String, MutableCollection<ColumnInfo>>()
            for(property in clazz.memberProperties) {
                val unique = property.findAnnotation<Unique>()
                if(unique == null) return  continue
                val columnInfo = ColumnInfo.create(property)!!
                val name = unique.index.valueOrDefault("UN_${clazz.simpleName!!.substring(0, 2).toUpperCase()}_${columnInfo.name.toUpperCase()}")
                if(res.containsKey(name)) res[name]!!.add(columnInfo)
                else res.put(name, mutableListOf(columnInfo))
            }

            if(res.isEmpty()) return null

            return res.map { UniqueKeyInfo(it.key, it.value) }
        }
    }
}