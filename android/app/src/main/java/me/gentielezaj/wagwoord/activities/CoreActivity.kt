package me.gentielezaj.wagwoord.activities
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.annotation.IdRes
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.material.appbar.AppBarLayout
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.AppUtil
import me.gentielezaj.wagwoord.common.Constants
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

    // region permission

    protected fun requestPermissionIfNeeded(permission: String, permissionResponseId: Int? = null) : Boolean {
        if(isPermissionGranted(permission)) return true
        requestPermission(permission, permissionResponseId)
        return false
    }

    protected open fun isPermissionGranted(permission: String) : Boolean = ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED
    protected open fun requestPermission(permission: String, permissionResponseId: Int? = null) {
        if (ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                permission
            )
        ) {
            // Show an explanation to the user *asynchronously* -- don't block
            // this thread waiting for the user's response! After the user
            // sees the explanation, try again to request the permission.
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(permission),
                permissionResponseId?:Constants.PermissionResponse.get(permission)
            )
        }
    }

    // endregion permission
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