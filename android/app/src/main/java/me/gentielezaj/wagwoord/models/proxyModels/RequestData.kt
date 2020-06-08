package me.gentielezaj.wagwoord.models.proxyModels

import com.android.volley.Request

data class RequestData(
    var action: String? = null,
    var data: Any? = null,
    var params: Map<String, String> = mapOf(),
    var controller: String? = null,
    var headers: MutableMap<String, String> = mutableMapOf(),
    var domain: String? = null,
    var method: Int = Request.Method.GET
) {
    constructor(method: Int) :  this(null, null, mapOf(), null, mutableMapOf(), null, method){}
    constructor(method: Int, data: Any) :  this(null, data, mapOf(), null, mutableMapOf(), null, method){}
    constructor(method: Int, params: Map<String, String>) :  this(null, null, params, null, mutableMapOf(), null, method){}
    constructor(method: Int, action: String?) :  this(action, null, mapOf(), null, mutableMapOf(), null, method){}
    constructor(method: Int, action: String?, params: Map<String, String>) :  this(action, null, params, null, mutableMapOf(), null, method){}

    companion object {
        fun Post(data: Any) = RequestData(Request.Method.POST, data);
        fun Patch(params: Map<String, String>, action: String? = null) = RequestData(Request.Method.PATCH, action, params)
    }
}