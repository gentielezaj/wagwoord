package me.gentielezaj.wagwoord.services.entity

import android.content.Context
import me.gentielezaj.wagwoord.models.entities.settings.Settings

class SettingsService(context: Context) : CoreEntityService<Settings>(context, Settings::class) {
    override suspend fun syncServer(): Boolean {
        TODO("Not yet implemented")
    }

    override suspend fun syncLocal(): Boolean {
        TODO("Not yet implemented")
    }
}