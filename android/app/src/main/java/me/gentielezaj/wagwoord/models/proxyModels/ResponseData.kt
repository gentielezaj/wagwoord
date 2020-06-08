package me.gentielezaj.wagwoord.models.proxyModels

import java.lang.Exception

data class ResponseData<T>(
    var data: T? = null,
    val code: Int = 0,
    val success: Boolean = false,
    var errorMessage: String? = null,
    val noProxy: Boolean = false,
    val exception: Exception? = null
)