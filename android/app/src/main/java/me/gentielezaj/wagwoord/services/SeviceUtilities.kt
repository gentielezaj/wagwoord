package me.gentielezaj.wagwoord.services

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import me.gentielezaj.wagwoord.services.proxy.ProxyService

public class ServiceUtilities (val context: Context) {
    fun hasInternetConnection() : Boolean {
        var state = internatConnactionStatus()
        return state != ConncetionStatus.None
    }

    fun internatConnactionStatus() : ConncetionStatus {
        val connMgr = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        if(connMgr.activeNetwork == null) return ConncetionStatus.None

        val caps: NetworkCapabilities = connMgr.getNetworkCapabilities(connMgr.activeNetwork)

        return if(caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) ConncetionStatus.CELLULAR else ConncetionStatus.WIFI
    }
}

enum class ConncetionStatus {
    None,
    WIFI,
    CELLULAR
}