package me.gentielezaj.wagwoord.services.proxy

import android.content.Context
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.Volley
import dev.turingcomplete.kotlinonetimepassword.HmacAlgorithm
import dev.turingcomplete.kotlinonetimepassword.HmacOneTimePasswordConfig
import dev.turingcomplete.kotlinonetimepassword.HmacOneTimePasswordGenerator
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import kotlinx.coroutines.*
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.common.empty
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import java.lang.Exception

class ProxyService(protected val context: Context, private val controller: String? = null) {
    var encryptionService = EncryptionService(context);

    suspend inline fun <reified T> get(action: String?, params: Map<String, String> = mapOf()): ResponseData<T> {
        return get(T::class.java, action, params)
    }

    suspend fun <T> get(entityType: Class<T>, action: String?, params: Map<String, String> = mapOf()): ResponseData<T> {
        return request(entityType, RequestData(action, params = params))
    }

    suspend inline fun <reified T> request(requestData: RequestData): ResponseData<T> {
        return request(T::class.java, requestData)
    }

    suspend fun <T> request(entityType: Class<T>, requestData: RequestData): ResponseData<T> {
        return sendRequest(requestData, entityType)
    }

    suspend fun isSet(forsed: Boolean = false) : Boolean {
        val domain = LocalStorage.get<String>(context, Constants.LocalStorageKeys.SERVER_URL);
        if(domain.isNullOrEmpty()) return false;
        else if(!forsed) return true;

        try {
            val response = sendRequest(
                RequestData(
                action = "isValidConnection",
                controller = "auth",
                    domain = domain
            ), Boolean::class.java)

            return response.data?: false
        } catch (e: Exception) {
            LogData(e, "proxyService.isSet()")
            return false;
        }
    }

    private suspend inline fun <T> sendRequest(requestData: RequestData, entityType: Class<T>): ResponseData<T> {
        val url = getUrl(requestData);
        if (url.isNullOrEmpty()) return ResponseData<T>(noProxy = true);

        var responseModel = suspendCancellableCoroutine<ResponseData<T>> {continuation ->
            val queue = Volley.newRequestQueue(context)
            val stringRequest = WWRequest<T>(
                requestData.method?: Request.Method.GET, url!!, headers(requestData.headers),
                Response.Listener<ResponseData<T>> { response ->
                    continuation.resume(response, {})
                },
                Response.ErrorListener { error ->
                    LogData(error, "Request", error.toString())
                    continuation.resume(ResponseData<T>(), {})
                },
                entityType = entityType
            )
            queue.add(stringRequest)
        }

        return responseModel
    }

    private fun getUrl(requestData: RequestData): String? {
        var url = requestData.domain ?: LocalStorage.get<String>(
            context,
            Constants.LocalStorageKeys.SERVER_URL
        )
        if (url.isNullOrEmpty()) return null

        if (!url.endsWith("/")) url += "/"

        url += requestData.controller ?: controller ?: ""

        if (!url.endsWith("/")) url += "/"

        url += requestData.action ?: ""

        return url
    }

    private fun headers(headers: Map<String, String>?) : MutableMap<String, String> {
        var header: MutableMap<String, String> = LocalStorage.get<MutableMap<String, String>>(
            context,
            Constants.LocalStorageKeys.SERVER_HEADERS,
            mutableMapOf()
        )

        if (headers != null) {
            header.putAll(headers)
        }

        var hash = encryptionService.getEncryptionHash();
        if(!hash.isNullOrEmpty()) {
            var counter = System.currentTimeMillis()
            var code = HmacOneTimePasswordGenerator(hash.toByteArray(), HmacOneTimePasswordConfig(codeDigits = 6, hmacAlgorithm = HmacAlgorithm.SHA1)).generate(counter)
            header["hash"] = "${code}-${code}"
        }
        else header["hash"] = String.empty

        return header;
    }
}

