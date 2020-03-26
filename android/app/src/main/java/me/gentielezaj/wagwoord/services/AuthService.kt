package me.gentielezaj.wagwoord.services

import android.content.Context
import com.android.volley.Request
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.models.ApiModes.SetupDataModel
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.proxy.ProxyService

public class AuthService(val context: Context) {
    val proxy: ProxyService = ProxyService(context, "auth")
    val encryption = EncryptionService(context)

    suspend fun login(domain: String, encryptionKey: String): ResponseData<SetupDataModel> {
        val encryptionHash = encryption.getEncryptionHashAndSave(encryptionKey)

        if (!domain.isNullOrEmpty()) {
            var request = RequestData("login", domain = domain, method = Request.Method.POST)
            if (!encryptionHash.isNullOrEmpty()) request.data = encryptionHash

            val response = proxy.request<SetupDataModel>(request)

            if(response.success && !response.noProxy)
                saveHeaders(response.data?.headers)

            return response;
        }

        return ResponseData<SetupDataModel>(success = true);
    }

    fun saveEncryption(encryptionKey: String) = encryption.getEncryptionHashAndSave(encryptionKey)

    fun saveHeaders(headers: Map<String, String>?) {
        if(headers == null || headers.isEmpty()) LocalStorage.remove(context, Constants.LocalStorageKeys.SERVER_HEADERS)
        LocalStorage.set(context, Constants.LocalStorageKeys.SERVER_HEADERS, headers)
    }
}