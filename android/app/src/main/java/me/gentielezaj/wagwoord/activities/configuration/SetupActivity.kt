package me.gentielezaj.wagwoord.activities.configuration

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.EditText
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.Constants
import kotlinx.coroutines.*
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.services.bindView
import me.gentielezaj.wagwoord.services.inject
import me.gentielezaj.wagwoord.services.repositories.CoreRepository
import me.gentielezaj.wagwoord.services.repositories.TotpRepository
import me.gentielezaj.wagwoord.services.util.UtilService
import java.lang.Exception

class SetupActivity : AppCompatActivity() {
    private val url: EditText by bindView(R.id.setup_url)
    private val encryptionKey by bindView<EditText>(R.id.setup_encryption_key)
    private val utilService by inject<UtilService>()
    private val passwordRepository by inject<CoreRepository<Password>>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setup)
    }

    fun testPassword() {
        var password = Password().apply {
            domain = "domia"
            password = "password"
            name = "name"
        }

        val id = passwordRepository.save(password)
        LogData(id.toString())
    }

    fun setup(view: View) {
        testPassword()
        if (!url.text.toString().isNullOrEmpty()) {

            if (ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET)
                != PackageManager.PERMISSION_GRANTED
            ) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(
                        this,
                        Manifest.permission.INTERNET
                    )
                ) {
                    // Show an explanation to the user *asynchronously* -- don't block
                    // this thread waiting for the user's response! After the user
                    // sees the explanation, try again to request the permission.
                } else {
                    // No explanation needed, we can request the permission.
                    ActivityCompat.requestPermissions(
                        this,
                        arrayOf(Manifest.permission.INTERNET),
                        Constants.PermissionResponse.INTERNET
                    )

                    // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                    // app-defined int constant. The callback method gets the
                    // result of the request.
                }
            } else sendRequest()
        }
    }

    fun skip(view: View? = null) {
        LocalStorage.set(this, Constants.LocalStorageKeys.APP_IS_SETUP, true);
        startActivity(Intent(this, MainActivity::class.java))
    }

    fun sendRequest() {
        GlobalScope.launch {
            try {
                if(utilService.startup(url.text.toString(), encryptionKey.text.toString())) {
                    utilService.updateAll()
                    skip()
                }
            } catch (e: Exception) {
                LogData(e, "Startup")
                throw e;
            }
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
}
