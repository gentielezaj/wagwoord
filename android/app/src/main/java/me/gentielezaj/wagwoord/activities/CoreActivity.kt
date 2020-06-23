package me.gentielezaj.wagwoord.activities
import android.os.Bundle
import androidx.annotation.IdRes
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.appbar.AppBarLayout
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.services.bindView

abstract class CoreActivity : AppCompatActivity() {
    val localStorage = LocalStorage(this)
    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        return super.onCreate(savedInstanceState)
    }

    fun launch(statement: suspend () -> Unit) {
        GlobalScope.launch(Dispatchers.Main) {
            statement()
        }
    }
}

abstract class CoreToolbarActivity(@IdRes val layoutId: Int) : CoreActivity() {
    private val toolbar by bindView<Toolbar>(R.id.toolbar)
    private val appBar by bindView<AppBarLayout>(R.id.app_bar)

    override fun onCreate(savedInstanceState: Bundle?) {
        return super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // region toolbar
        toolbar.title = "View"
        setSupportActionBar(toolbar)
        // endregion toolbar
    }
}