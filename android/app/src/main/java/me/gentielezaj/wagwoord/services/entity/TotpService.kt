package me.gentielezaj.wagwoord.services.entity

import android.content.Context
import me.gentielezaj.sqldroid.query.Order
import me.gentielezaj.wagwoord.models.entities.Totp

class TotpService(context: Context) : CoreEntityService<Totp>(context, Totp::class, "codegenerator")