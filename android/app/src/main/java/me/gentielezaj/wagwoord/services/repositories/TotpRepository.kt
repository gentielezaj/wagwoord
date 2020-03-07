package me.gentielezaj.wagwoord.services.repositories

import android.content.Context
import me.gentielezaj.wagwoord.models.entities.Totp

class TotpRepository(context: Context) : CoreRepository<Totp>(context, Totp::class, "codegenerator")