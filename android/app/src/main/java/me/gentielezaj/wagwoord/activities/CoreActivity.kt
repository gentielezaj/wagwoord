package me.gentielezaj.wagwoord.activities
import android.app.Activity
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.annotation.IdRes
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.google.android.material.appbar.AppBarLayout
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.AppUtil
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.services.bindView

abstract class CoreActivity : AppCompatActivity() {
    val localStorage = LocalStorage(this)
    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        return super.onCreate(savedInstanceState)
    }

    fun launch(statement: suspend () -> Unit) = AppUtil.launch(statement)

    fun closeKeyboard() {
        val imm: InputMethodManager =
            getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
        val view: View = currentFocus ?: View(this)
        imm.hideSoftInputFromWindow(view.applicationWindowToken, 0)
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