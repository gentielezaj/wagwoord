package me.gentielezaj.wagwoord.services

import android.content.Context
import com.android.volley.Request
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.common.RequestUrl
import me.gentielezaj.wagwoord.models.ApiModes.SetupDataModel
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.proxy.ProxyService
import kotlin.math.log

public class AuthService(val context: Context) {
    val proxy: ProxyService = ProxyService(context, "auth")
    val encryption = EncryptionService(context)

    suspend fun login(domain: String, encryptionKey: String): ResponseData<SetupDataModel> {
        val encryptionHash = encryption.getEncryptionHash(encryptionKey)

        if (!domain.isNullOrEmpty()) {
            var request = RequestData("", domain = domain, method = Request.Method.POST, data = encryptionHash)

            val response = proxy.request<String>(request)

            if(!response.success || response.noProxy) {
                return ResponseData<SetupDataModel>(success = false, errorMessage = context.getString(R.string.server_error));
            }
            else if(response.data == Constants.LoginAuthTypes.UNAUTHRISED) {
                return ResponseData<SetupDataModel>(success = false, errorMessage = context.getString(R.string.unauthorised));
            }

            var loginRequest = if(response.data == Constants.LoginAuthTypes.LOGIN) {
                RequestData(RequestUrl.Auth.login, domain = domain, method = Request.Method.POST)
            } else {
                syncFromServer()
                RequestData(RequestUrl.Auth.change, domain = domain, method = Request.Method.POST)
            }

            var loginResponse = proxy.request<SetupDataModel>(loginRequest);
            if(loginResponse.success) {
                saveEncryption(encryptionKey);
                sync()
            }
            return loginResponse;
        } else {
            saveEncryption(encryptionKey);
            return ResponseData<SetupDataModel>(success = true);
        }
    }

    private fun syncFromServer() {}
    private fun syncServer() {}
    private fun sync() {}

    private fun saveEncryption(encryptionKey: String) { encryption.encryptionKey = encryptionKey }

    private fun saveHeaders(headers: Map<String, String>?) {
        if(headers == null || headers.isEmpty()) LocalStorage.remove(context, Constants.LocalStorageKeys.SERVER_HEADERS)
        LocalStorage.set(context, Constants.LocalStorageKeys.SERVER_HEADERS, headers)
    }
}