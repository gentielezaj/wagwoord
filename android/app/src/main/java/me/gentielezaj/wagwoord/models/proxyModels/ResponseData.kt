package me.gentielezaj.wagwoord.models.proxyModels

data class ResponseData<T>(
    var data: T? = null,
    val code: Int = 0,
    val success: Boolean = false,
    val errorMessage: String? = null,
    val noProxy: Boolean = false
)