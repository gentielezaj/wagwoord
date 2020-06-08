package me.gentielezaj.wagwoord.services

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.common.ServerStatus
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
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