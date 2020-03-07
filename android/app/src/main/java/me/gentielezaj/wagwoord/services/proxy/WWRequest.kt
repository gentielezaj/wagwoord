package me.gentielezaj.wagwoord.services.proxy

import com.android.volley.NetworkResponse
import com.android.volley.ParseError
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.HttpHeaderParser
import com.google.gson.Gson
import com.google.gson.JsonParser
import com.google.gson.JsonSyntaxException
import com.google.gson.reflect.TypeToken
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import java.io.UnsupportedEncodingException
import java.lang.reflect.Type
import java.nio.charset.Charset

class WWRequest<T>(
    method: Int,
    url: String,
    private val headers: MutableMap<String, String>?,
    private val listener: Response.Listener<ResponseData<T>>,
    errorListener: Response.ErrorListener,
    private val entityType: Type
) : Request<ResponseData<T>>(method, url, errorListener) {
    private val gson = Gson()

    override fun getHeaders(): MutableMap<String, String> {
        return headers ?: super.getHeaders()
    }

    override fun deliverResponse(response: ResponseData<T>) = listener.onResponse(response)

    override fun parseNetworkResponse(response: NetworkResponse?): Response<ResponseData<T>> {
        return try {
            val json = String(
                response?.data ?: ByteArray(0),
                Charset.forName(HttpHeaderParser.parseCharset(response?.headers))
            )
            val jObject = JsonParser().parse(json).asJsonObject
            val data: T? =
                if(jObject.get("success").asBoolean) gson.fromJson<T?>(jObject.get("data"), entityType)
                else null

            val model = gson.fromJson<ResponseData<T>>(json)
            if(model.success && data != null) model.data = data

            Response.success(
                model,
                HttpHeaderParser.parseCacheHeaders(response)
            )
        } catch (e: UnsupportedEncodingException) {
            Response.error(ParseError(e))
        } catch (e: JsonSyntaxException) {
            Response.error(ParseError(e))
        }
    }

    inline fun <reified T> Gson.fromJson(json: String) =
        this.fromJson<T>(json, object : TypeToken<T>() {}.type)
}