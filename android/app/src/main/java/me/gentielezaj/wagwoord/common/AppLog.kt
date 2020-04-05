package me.gentielezaj.wagwoord.common

import android.util.Log

fun LogData(vararg text: String) {
    CoreLogData("log-data", text)
}

fun LogData(text: Any) {
    CoreLogData("log-data", arrayOf(text.toString()))
}

fun LogData(e: Exception, vararg text: String) {
    CoreLogData("log-data-e", text)
}

fun LogData(e: Exception, text: String) {
    CoreLogData("log-data-e", arrayOf(text))
}

private fun CoreLogData(tag: String, text: Array<out String>) {
    for(t in text) {
        Log.d(tag, t)
    }
}