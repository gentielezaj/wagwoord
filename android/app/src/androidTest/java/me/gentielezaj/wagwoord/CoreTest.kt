package me.gentielezaj.wagwoord

import androidx.test.platform.app.InstrumentationRegistry
import kotlinx.coroutines.*
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.services.proxy.ProxyService

abstract class CoreTest {
    val context
        get() = InstrumentationRegistry.getInstrumentation().targetContext

    val localStorage
        get() = LocalStorage(context)

    fun run(statement: suspend () -> Unit) : Job {
        return GlobalScope.launch(Dispatchers.Main) {
            statement()
        }
    }
}