package me.gentielezaj.wagwoord.services.proxy

import android.content.Context
import android.util.Log
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.Volley
import dev.turingcomplete.kotlinonetimepassword.HmacAlgorithm
import dev.turingcomplete.kotlinonetimepassword.HmacOneTimePasswordConfig
import dev.turingcomplete.kotlinonetimepassword.HmacOneTimePasswordGenerator
import kotlinx.coroutines.*
import me.gentielezaj.wagwoord.common.*
import me.gentielezaj.wagwoord.models.proxyModels.RequestData
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import me.gentielezaj.wagwoord.services.ServiceUtilities
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import java.lang.Exception
import kotlin.reflect.KClass
import kotlin.reflect.full.createInstance
import kotlin.reflect.full.createType
import kotlin.reflect.full.primaryConstructor

class ProxyService(protected val context: Context, private val controller: String? = null) {
    var encryptionService = EncryptionService(context);
    val localStorage = LocalStorage(context)
    val serviceUtilities = ServiceUtilities(context)

    fun setDomain(domain: String? = null) {
        if(domain.isNullOrEmpty()) localStorage.remove(Constants.LocalStorageKeys.SERVER_URL)
        else localStorage.set(Constants.LocalStorageKeys.SERVER_URL, domain)
    }

    fun setHeaders(headers: Map<String, String>? = null) {
        if(headers == null) localStorage.remove(Constants.LocalStorageKeys.SERVER_HEADERS)
        else localStorage.set(Constants.LocalStorageKeys.SERVER_HEADERS, headers)
    }

    // endregion get
    suspend inline fun <reified T: Any> get(action: String?, params: Map<String, String> = mapOf()): ResponseData<T> {
        return get(T::class, action, params)
    }

    suspend fun <T: Any> get(entityType: KClass<T>, action: String?, params: Map<String, String> = mapOf()): ResponseData<T> {
        return request(entityType, RequestData(action, params = params))
    }
    // endregion get


    // endregion delete
    suspend inline fun delete(id: Int): ResponseData<Any> {
        return request<Any>(RequestData(data = id, method = Request.Method.DELETE))
    }

    suspend inline fun delete(ids: String): ResponseData<Any> {
        return request<Any>(RequestData(method =  Request.Method.DELETE, data = ids))
    }

    // endregion delete

    suspend inline fun <reified T: Any> request(requestData: RequestData): ResponseData<T> {
        return request(T::class, requestData)
    }

    suspend fun <T: Any> request(entityType: KClass<out Any>, requestData: RequestData): ResponseData<T> {
        return sendRequest(requestData, entityType)
    }

    suspend fun <T: Any> requestList(entityType: KClass<out Any>, requestData: RequestData): ResponseData<List<T>> {
        return sendRequestList(requestData, entityType)
    }

    suspend fun isSet(force: Boolean) : ServerStatus {
        val domain = localStorage.get<String>(Constants.LocalStorageKeys.SERVER_URL);
        if(domain.isNullOrEmpty()) return ServerStatus.OFF;

        if(!force) {
            return localStorage.get<ServerStatus>(Constants.LocalStorageKeys.SERVER_STATUS, ServerStatus.ERROR)
        }

        try {
            val response = sendRequest<Boolean>(
                RequestData(
                action = "isValidConnection",
                controller = "auth"
            ), Boolean::class)

            val status = if(response.success) ServerStatus.OK else ServerStatus.ERROR
            localStorage.set(Constants.LocalStorageKeys.SERVER_STATUS, status)

            return status;
        } catch (e: Exception) {
            LogData(e, "proxyService.isSet()")
            throw e;
        }
    }

    private suspend inline fun <T: Any> sendRequest(requestData: RequestData, entityType: KClass<out Any>): ResponseData<T> {
        @Suppress("UNCHECKED_CAST")
        return sendRequest(requestData, entityType, WWRequest::class as KClass<CoreRequest<T>>)
    }

    private suspend inline fun <T: Any> sendRequestList(requestData: RequestData, entityType: KClass<out Any>): ResponseData<T> {
        @Suppress("UNCHECKED_CAST")
        return sendRequest(requestData, entityType, WWRequestList::class as KClass<CoreRequest<T>>)
    }

    private suspend inline fun <T: Any> sendRequest(requestData: RequestData, entityType: KClass<out Any>, wwRequestType: KClass<CoreRequest<T>>): ResponseData<T> {
        if(!serviceUtilities.hasInternetConnection()) {
            Log.d("PROXY", "-- PROXY => no Internet")
            return ResponseData(null, 0, false, "No Intrnat", true)
        }
        var domain = requestData.domain
        if(domain.isNullOrEmpty()) {
            domain = localStorage.get<String>(Constants.LocalStorageKeys.SERVER_URL)
        }
        if(domain.isNullOrEmpty()) {
            return ResponseData(null, 0, false, "No Intrnat", true)
        }

        val url = getUrl(requestData, domain);
        if (url.isNullOrEmpty()) return ResponseData<T>(noProxy = true);

        var responseModel = suspendCancellableCoroutine<ResponseData<T>> {continuation ->
            val queue = Volley.newRequestQueue(context)
            var stringRequest = wwRequestType.primaryConstructor!!.call(
                requestData.method?: Request.Method.GET, url!!, headers(requestData.headers),
                Response.Listener<ResponseData<T>> { response ->
                    continuation.resume(response, {})
                },
                Response.ErrorListener { error ->
                    LogData(error, "Request", error.toString())
                    continuation.resume(ResponseData<T>(exception = error), {})
                },
                entityType.java,
                requestData.data
            )
            queue.add(stringRequest)
        }

        return responseModel
    }

    private suspend inline fun <T: Any> baseSendRequest(requestData: RequestData, entityType: KClass<out Any>): ResponseData<T> {
        if(!serviceUtilities.hasInternetConnection()) return ResponseData(null, 0, false, "No Intrnat", true)
        var domain = requestData.domain
        if(domain.isNullOrEmpty()) {
            domain = localStorage.get<String>(Constants.LocalStorageKeys.SERVER_URL)
        }
        if(domain.isNullOrEmpty()) {
            return ResponseData(null, 0, false, "No Intrnat", true)
        }

        val url = getUrl(requestData, domain);
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
                entityType = entityType.java,
                data = requestData.data
            )
            queue.add(stringRequest)
        }

        return responseModel
    }

    private fun getUrl(requestData: RequestData, domain: String): String? {
        var url = domain
        if (url.isNullOrEmpty()) return null

        if (!url.endsWith("/")) url += "/"

        url += requestData.controller ?: controller ?: ""

        if (!url.endsWith("/")) url += "/"

        url += requestData.action ?: ""

        return url
    }

    private fun headers(headers: Map<String, String>?) : MutableMap<String, String> {
        var header: MutableMap<String, String> = localStorage.get<MutableMap<String, String>>(
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
            header["hash"] = "${code}-${counter}"
        }
        else header["hash"] = String.empty

        return header;
    }
}

