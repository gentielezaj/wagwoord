package me.gentielezaj.wagwoord.services

import android.content.Context
import me.gentielezaj.wagwoord.database.Database
import me.gentielezaj.wagwoord.models.entities.*
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.entity.CoreService
import kotlin.reflect.KClass

class BackgroundService (context: Context) : BaseService(context) {
    val entities = listOf<KClass<out IEntity>>(Password::class, Totp::class, Address::class, Blacklist::class, CreditCard::class)
    private val db = Database(context)

    /**
     *  set up the database
     */
    fun onStart() {
        db.version()
    }

    suspend fun sync() : Boolean {
        val results = loop {
            it.sync();
        }

        return results.all { it }
    }

    suspend fun syncLocal(): Boolean {
        val results = loop {
            it.syncLocal();
        }

        return results.all { it }
    }

    suspend fun syncServer() : Boolean {
        val results = loop {
            it.syncServer();
        }

        return results.all { it }
    }

    private suspend fun <TResult> loop(f: suspend (CoreService<out IEntity>) -> TResult) : List<TResult> {
        val results = mutableListOf<TResult>()
        for (entity in entities) {
            val service by injectEntityService(entity)
            results.add(f(service))
        }

        return  results
    }
}
