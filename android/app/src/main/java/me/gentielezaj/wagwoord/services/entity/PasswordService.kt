package me.gentielezaj.wagwoord.services.entity

import android.content.Context
import me.gentielezaj.sqldroid.IQueryBuilder
import me.gentielezaj.sqldroid.query.ICriteria
import me.gentielezaj.sqldroid.query.Order
import me.gentielezaj.sqldroid.query.Restriction.Companion.contains
import me.gentielezaj.sqldroid.query.Where
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataOrderDirection
import me.gentielezaj.wagwoord.models.annotations.orderDirection
import me.gentielezaj.wagwoord.models.entities.Password
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

class PasswordService(context: Context) : CoreEntityCountService<Password>(context, Password::class) {

    // region get

    override suspend fun coreList(text: String?) : List<Password> {
        val properties = type.memberProperties.filter { it.findAnnotation<ListData>() != null }

        if(properties.isEmpty()) return repository.toList()

        val query = repository.queryBuilder
        val criteria = mutableListOf<ICriteria<Password>>()
        val prop = mutableListOf<KProperty1<Password, *>>()
        for(property in properties) {
            val listData = property.findAnnotation<ListData>()!!
            if(listData.searchable) prop.add(property)
            if(listData.orderBy != ListDataOrderDirection.None) query.orderBy(Order.By(property, orderDirection(listData.orderBy)!!))
        }

        if(!text.isNullOrEmpty()) {
            val and = Where.AND<Password>()
            for(i in text.split(" ")) {
                if(i.isEmpty()) continue

                val or = Where.OR<Password>()
                for (p in prop) {
                    or.add(p contains i)
                }
                and.add(or)
            }

            if(!and.empty()) criteria.add(and)
        }

        if(criteria.any()) query.where(Where.OR(criteria))
        return repository.toList(query)
    }
    // endregion get
}