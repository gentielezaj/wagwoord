package me.gentielezaj.wagwoord.activities.auth

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.TextView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.activities.settings.SettingsActivity
import me.gentielezaj.wagwoord.common.Notificaiton
import me.gentielezaj.wagwoord.services.dependencyInjection.bindView

class RequestAutofillPermissionActivity : CoreActivity() {
    private var continueToLogin = false

    private val textViewStatus: TextView by bindView(R.id.request_autofill_permission_status)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_request_autofill_permission)

        val text = if (!isPermissionGranted(android.Manifest.permission.BIND_AUTOFILL_SERVICE)) R.string.permission_denied
        else R.string.permission_granted

        continueToLogin = intent.getBooleanExtra(CONTINUE_TO_LOGIN, false)

        textViewStatus.text = getString(text)
    }

    private fun checkPermission() {
        if (!isPermissionGranted(android.Manifest.permission.BIND_AUTOFILL_SERVICE)) {
            val intent = Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE)
            intent.data = Uri.parse("package:me.gentielezaj.wagwoord")
            startActivityForResult(intent, SettingsActivity.SETTINGS_AUTOFILL_REQUEST)
        } else if(continueToLogin) startActivity(Intent(this, LoginActivity::class.java))
    }

    fun openPermission(view: View) {
        val intent = Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE)
        intent.data = Uri.parse("package:me.gentielezaj.wagwoord")
        startActivityForResult(intent, SettingsActivity.SETTINGS_AUTOFILL_REQUEST)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val text = if (requestCode == SettingsActivity.SETTINGS_AUTOFILL_REQUEST && resultCode == Activity.RESULT_OK) R.string.permission_granted
            else R.string.permission_denied

        textViewStatus.text = getString(text)

        if(continueToLogin) {
            Notificaiton.notify(this, text)
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }

    companion object {
        val CONTINUE_TO_LOGIN = "continue_to_login"
    }
}