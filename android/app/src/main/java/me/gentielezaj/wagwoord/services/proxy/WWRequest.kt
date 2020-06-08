package me.gentielezaj.wagwoord.services.proxy

import com.android.volley.*
import com.android.volley.toolbox.HttpHeaderParser
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.google.gson.JsonSyntaxException
import com.google.gson.reflect.TypeToken
import me.gentielezaj.wagwoord.models.proxyModels.ResponseData
import org.json.JSONObject
import java.io.UnsupportedEncodingException
import java.lang.reflect.Type
import java.nio.charset.Charset
import kotlin.reflect.typeOf

abstract class CoreRequest<T>(
    method: Int,
url: String,
private val headers: MutableMap<String, String>?,
private val listener: Response.Listener<ResponseData<T>>,
errorListener: Response.ErrorListener,
protected val entityType: Type,
private val data: Any? = null
) : Request<ResponseData<T>>(method, url, errorListener) {
    protected val gson = Gson()

    override fun getHeaders(): MutableMap<String, String> {
        return headers ?: super.getHeaders()
    }

    override  fun getBodyContentType() : String {
        return "application/json; charset=utf-8";
    }

    override fun getBody() : ByteArray? {
        var body = when(data) {
            null -> null;
            is String -> data.toByteArray();
            else -> gson.toJson(data).toByteArray()
        }

        return body
    }

    abstract fun handelData(json: JsonObject) : T?;

    override fun parseNetworkResponse(response: NetworkResponse?): Response<ResponseData<T>> {
        return try {
            val json = String(
                response?.data ?: ByteArray(0),
                Charset.forName(HttpHeaderParser.parseCharset(response?.headers))
            )
            val jObject = JsonParser().parse(json).asJsonObject

            val model = gson.fromJson<ResponseData<T>>(json)
            if(model.success && model.data != null) model.data = handelData(jObject)

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

    override fun deliverResponse(response: ResponseData<T>) = listener.onResponse(response)

    inline fun <reified T> Gson.fromJson(json: String) =
        this.fromJson<T>(json, object : TypeToken<T>() {}.type)
}

class WWRequestList<T>(
    method: Int,
    url: String,
    headers: MutableMap<String, String>?,
    listener: Response.Listener<ResponseData<List<T>>>,
    errorListener: Response.ErrorListener,
    entityType: Type,
    data: Any? = null
) : CoreRequest<List<T>>(method, url, headers, listener, errorListener, entityType, data) {
    override fun handelData(json: JsonObject): List<T>? {
        var data: MutableList<T>? = null;
        if(json.get("data") != null) {
            data = mutableListOf()
            var datalist = JsonParser().parse(json.get("data").toString()).asJsonArray
            for(dataItem in datalist) {
                data.add(gson.fromJson<T>(dataItem, entityType))
            }
        }

        return data;
    }
}

open class WWRequest<T>(
    method: Int,
    url: String,
    headers: MutableMap<String, String>?,
    listener: Response.Listener<ResponseData<T>>,
    errorListener: Response.ErrorListener,
    entityType: Type,
    data: Any? = null
) : CoreRequest<T>(method, url, headers, listener, errorListener, entityType, data) {


    override fun handelData(json: JsonObject): T? {
        var data: T? = null;
        if(json.get("data") != null) {
            data = gson.fromJson<T?>(json.get("data"), entityType)
        }

        return data;
    }
}