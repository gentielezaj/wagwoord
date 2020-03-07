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
}