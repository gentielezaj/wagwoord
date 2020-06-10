package me.gentielezaj.wagwoord.services.entity

import android.content.Context
import me.gentielezaj.wagwoord.models.entities.Totp

class TotpService(context: Context) : CoreEntityService<Totp>(context, Totp::class) {
    override fun getControllerName(): String = "codegenerator"
}