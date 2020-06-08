package me.gentielezaj.wagwoord.services

import android.content.Context
import com.android.volley.Request
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.*
import me.gentielezaj.wagwoord.models.ApiModes.SetupDataModel
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.proxy.ProxyService

public class AuthService(context: Context) : BaseService(context) {
    val proxy: ProxyService = ProxyService(context, "auth")
    val backgroundService = BackgroundService(context)
    val encryption = EncryptionService(context)

    suspend fun login(domain: String, encryptionKey: String): ResponseData<out Any> {
        val newEncryptionHash = encryption.getEncryptionHash(encryptionKey)?: String.empty
        var oldEncryptionHash = encryption.getEncryptionHash()?: String.empty
        if (!domain.isNullOrEmpty()) {
            var request = RequestData("", domain = domain, method = Request.Method.POST, data = mapOf("newEncryptionHash" to newEncryptionHash, "oldEncryptionHash" to oldEncryptionHash))

            val response = proxy.request<String>(request)

            if(!response.success || response.noProxy) {
                response.errorMessage = context.getString(R.string.server_error);
                return response
            }
            else if(response.data == Constants.LoginAuthTypes.UNAUTHRISED) {
                return response.copy(success = false, errorMessage = context.getString(R.string.unauthorised));
            }

            var loginRequest = if(response.data == Constants.LoginAuthTypes.LOGIN) {
                RequestData(RequestUrl.Auth.login, domain = domain, method = Request.Method.POST, data = mapOf("encryptionHash" to newEncryptionHash))
            } else {
                backgroundService.syncLocal()
                RequestData(RequestUrl.Auth.change, domain = domain, method = Request.Method.POST, data = mapOf("encryptionHash" to newEncryptionHash))
            }

            var loginResponse = proxy.request<SetupDataModel>(loginRequest);
            if(loginResponse.success) {
                proxy.setDomain(domain)
                proxy.setHeaders(loginResponse.data?.headers)
                saveEncryption(encryptionKey);
                if(proxy.isSet(true) != ServerStatus.OK) {
                    proxy.setDomain()
                    proxy.setHeaders()
                    saveEncryption(String.empty);
                    return ResponseData<SetupDataModel>(
                        success = false,
                        errorMessage = context.getString(R.string.server_error)
                    );
                }

                backgroundService.sync()
            }
            return loginResponse;
        } else {
            proxy.setDomain()
            proxy.setHeaders()
            saveEncryption(encryptionKey);
            return ResponseData<SetupDataModel>(success = true);
        }
    }

    private fun saveEncryption(encryptionKey: String) { encryption.encryptionKey = encryptionKey }

    private fun saveHeaders(headers: Map<String, String>?) {
        if(headers == null || headers.isEmpty()) LocalStorage.remove(context, Constants.LocalStorageKeys.SERVER_HEADERS)
        LocalStorage.set(context, Constants.LocalStorageKeys.SERVER_HEADERS, headers)
    }
}