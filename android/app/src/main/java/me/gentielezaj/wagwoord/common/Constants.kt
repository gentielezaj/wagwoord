package me.gentielezaj.wagwoord.common

import android.content.Context

class Constants {
    public class LocalStorageKeys {
        companion object {
            val SHARED_PREFERENCES = "ww_app_shared_preferences"
            val APP_IS_SETUP = "ww_app_is_setup"
            val SERVER_URL = "ww_server_url"
            val SERVER_HEADERS = "ww_headers"
            val ENCRYPTION_KEY = "ww_encryption_key"
            val ENCRYPTION_HASH = "ww_encryption_hash"
            val SERVER_STATUS = "server-status"
        }
    }

    class PermissionResponse(val value:Int) {
        companion object {
            val INTERNET = 1
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