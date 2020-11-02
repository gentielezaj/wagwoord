package me.gentielezaj.wagwoord.common

import android.Manifest
import android.content.Context

class Constants {
    public class LocalStorageKeys {
        companion object {
            val SHARED_PREFERENCES = "ww_app_shared_preferences"
            val APP_IS_SETUP = "ww_app_is_setup"
            val SERVER_URL = "ww_server_url"
            val SERVER_HEADERS = "ww_headers"
            val ENCRYPTION_KEY = "ww_encryption_key"
            val ENCRYPT_LOCAL = "ww_encryption_local"
            val ENCRYPTION_HASH = "ww_encryption_hash"
            val SERVER_STATUS = "server-status"
        }
    }

    class PermissionResponse(val value:Int) {
        companion object {
            val INTERNET = 1
            val AUTOFILL = 2

            val permissionsCodes = mapOf(
                Manifest.permission.INTERNET to INTERNET,
                Manifest.permission.BIND_AUTOFILL_SERVICE to AUTOFILL
            )

            fun get(permission: String) : Int = permissionsCodes[permission]?: error("Unknown permission code")
        }
    }

    class LoginAuthTypes {
        companion object {
            val UNAUTHRISED = "unAuthorised"
            val LOGIN = "login"
            val CHANGE = "change"
        }
    }
}

class RequestUrl() {
    class Auth {
        companion object {
            val login = "login"
            val change = "change"
        }
    }
}