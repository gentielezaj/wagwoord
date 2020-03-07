package me.gentielezaj.wagwoord.services.util

import android.content.Context
import com.android.volley.Request
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.models.ApiModes.SetupDataModel
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.proxy.ProxyService

class UtilService(val context: Context) {
    val proxy: ProxyService = ProxyService(context, "util")
    val encryption = EncryptionService(context)

    suspend fun startup(domain: String, encryptionKey: String): Boolean {
        val encryptionHash = encryption.getEncryptionHashAndSave(encryptionKey)

        if (!domain.isNullOrEmpty()) {
            var request = RequestData("startup", domain = domain, method = Request.Method.POST)
            if (!encryptionHash.isNullOrEmpty()) request.data = encryptionHash

            val response = proxy.request<SetupDataModel>(request)

            if(!response.success || response.noProxy) return false;

            saveHeaders(response.data?.headers)
            return true;
        }

        return true;
    }

    fun updateAll() {}

    fun saveHeaders(headers: Map<String, String>?) {
        if(headers == null || headers.isEmpty()) LocalStorage.remove(context, Constants.LocalStorageKeys.SERVER_HEADERS)
        LocalStorage.set(context, Constants.LocalStorageKeys.SERVER_HEADERS, headers)
    }
}