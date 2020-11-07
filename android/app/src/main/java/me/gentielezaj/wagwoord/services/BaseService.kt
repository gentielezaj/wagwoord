package me.gentielezaj.wagwoord.services

import android.content.Context
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.dependencyInjection.DI
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import kotlin.reflect.KClass


abstract class BaseService(val context: Context) {
    val localStorage = LocalStorage(context)
    var serviceUtilities = ServiceUtilities(context)

    inline fun <reified TEntity: IEntity> injectEntityService() : Lazy<out CoreEntityService<TEntity>> {
        @Suppress("UNCHECKED_CAST")
        return lazy { DI.resolveEntity<TEntity>(context) }
    }

    inline fun <TEntity: IEntity> injectEntityService(entity: KClass<TEntity>) : Lazy<out CoreEntityService<TEntity>> {
        return lazy { DI.resolveEntity<TEntity>(context, entity) }
    }
}