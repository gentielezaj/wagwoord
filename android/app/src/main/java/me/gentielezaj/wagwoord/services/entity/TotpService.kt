package me.gentielezaj.wagwoord.services.entity

import android.content.Context
import me.gentielezaj.wagwoord.services.proxy.ProxyService

class TotpService(private val context: Context) {
    val proxy = ProxyService(context, "codegenerator")
}