package me.gentielezaj.wagwoord.activities.auth

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import br.com.simplepass.loadingbutton.customViews.CircularProgressButton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.common.*
import me.gentielezaj.wagwoord.services.AuthService
import me.gentielezaj.wagwoord.services.BackgroundService
import me.gentielezaj.wagwoord.services.bindView
import me.gentielezaj.wagwoord.services.inject

class LoginActivity : CoreActivity() {
    private val backgroundService by inject<BackgroundService>()
    private val authService by inject<AuthService>()
    private val url: EditText by bindView(R.id.setup_url)
    private val encryptionKey by bindView<EditText>(R.id.setup_encryption_key)
    private val btnLogin by bindView<CircularProgressButton>(R.id.btn_login);
    private val errorMessageTextView by bindView<TextView>(R.id.login_error_message);

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
    }

    fun skip(view: View? = null) {
        LocalStorage.set(this, Constants.LocalStorageKeys.APP_IS_SETUP, true);
        startActivity(Intent(this, MainActivity::class.java))
    }

    fun login(view: View) {
        errorMessageTextView.text = String.empty;
        btnLogin.startAnimation()
        if (!url.text.toString().isNullOrEmpty()) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED)
                requestPermission()
            else
                sendRequest()
        }
    }

    fun sendRequest() {
        launch {
            try {
                var authenticate = authService.login(url.text.toString(), encryptionKey.text.toString())
                if(authenticate.success) {
                    val color = ContextCompat.getColor(this, R.color.success)
                    btnLogin.doneLoadingAnimation(color, AppUtil.vectorToBitmap(this, R.drawable.ic_check))
                    Toast.makeText(applicationContext, getString(R.string.welcome), Toast.LENGTH_SHORT).show()
                    backgroundService.updateAll()
                    Toast.makeText(applicationContext, getString(R.string.data_updated), Toast.LENGTH_SHORT).show()
                    skip()
                } else {
                    errorMessageTextView.text = getString(R.string.login_failed)
                    btnLogin.revertAnimation()
                    Toast.makeText(applicationContext, getString(R.string.login_failed), Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                errorMessageTextView.text = getString(R.string.login_failed)
                LogData(e, "Startup")
                throw e;
            }
        }
    }

    // region permission

    fun requestPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                Manifest.permission.INTERNET
            )
        ) {
            // Show an explanation to the user *asynchronously* -- don't block
            // this thread waiting for the user's response! After the user
            // sees the explanation, try again to request the permission.
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.INTERNET),
                Constants.PermissionResponse.INTERNET
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>, grantResults: IntArray
    ) {
        when (requestCode) {
            Constants.PermissionResponse.INTERNET -> {
                // If request is cancelled, the result arrays are empty.
                if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                    sendRequest()
                } else {
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                    TODO("if permission internet not greted?")
                }
                return
            }

            // Add other 'when' lines to check for other
            // permissions this app might request.
            else -> {
                // Ignore all other requests.
            }
        }
    }
    // endregion

    override fun onDestroy() {
        super.onDestroy()
        btnLogin.dispose()
    }
}
