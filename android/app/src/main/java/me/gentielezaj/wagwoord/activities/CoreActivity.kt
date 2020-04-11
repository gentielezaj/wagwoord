package me.gentielezaj.wagwoord.activities
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

abstract class CoreActivity : AppCompatActivity() {
    fun launch(statement: suspend () -> Unit) {
        GlobalScope.launch(Dispatchers.Main) {
            statement()
        }
    }
}