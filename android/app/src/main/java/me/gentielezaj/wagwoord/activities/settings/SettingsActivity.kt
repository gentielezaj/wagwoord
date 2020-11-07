package me.gentielezaj.wagwoord.activities.settings

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.SwitchPreferenceCompat
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.activities.auth.LoginActivity
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.dependencyInjection.inject

enum class SettingsPreferenceKeys(val value:String) {
    OPEN_LOGIN("open_login"),
    OPEN_AUTOFILL("settings_open_autofill"),
    ENCRYPT_LOCAL("settings_encrypt_data_locally")
}

class SettingsActivity : CoreActivity() {

    private val FRAGMENT_TAG: String = "app_settings_preference_fragment"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.settings_activity)
        supportFragmentManager
            .beginTransaction()
            .replace(R.id.settings, SettingsFragment(), FRAGMENT_TAG)
            .commit()
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        when(requestCode) {
            SETTINGS_AUTOFILL_REQUEST -> {
                val fragment = supportFragmentManager.findFragmentByTag(FRAGMENT_TAG) as SettingsFragment
                val text = if(resultCode == Activity.RESULT_OK) R.string.settings_category_security_autofill_summary_granted else R.string.settings_category_security_autofill_summary_denied
                fragment.changeSummaryTextFor(SettingsPreferenceKeys.OPEN_AUTOFILL, text)
            }
        }
    }

    class SettingsFragment : PreferenceFragmentCompat() {

        val encryptionService: EncryptionService by inject()

        override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey)
            val loginPreference = preferenceManager.findPreference<Preference>(SettingsPreferenceKeys.OPEN_LOGIN.value)!!
            loginPreference.setOnPreferenceClickListener {
                val intent = Intent(activity, LoginActivity::class.java)
                intent.putExtra(LoginActivity.HIDE_SKIP_BUTTON_KEY, true)
                startActivity(intent)
                true
            }

            setSecurityPreference()
        }

        private fun setSecurityPreference() {
            val autofillButton = preferenceManager.findPreference<Preference>(SettingsPreferenceKeys.OPEN_AUTOFILL.value)!!
            autofillButton.setOnPreferenceClickListener {
                val intent = Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE)
                intent.data = Uri.parse("package:me.gentielezaj.wagwoord")
                startActivityForResult(intent, SETTINGS_AUTOFILL_REQUEST)
                true
            }

            val encryptLocalPreference = preferenceManager.findPreference<SwitchPreferenceCompat>(SettingsPreferenceKeys.ENCRYPT_LOCAL.value)!!
            encryptLocalPreference.isChecked = encryptionService.encryptLocal
            encryptLocalPreference.setOnPreferenceChangeListener { preference, newValue ->
                encryptionService.encryptLocal = newValue as Boolean
                true
            }
        }

        fun changeSummaryTextFor(preferenceKey: SettingsPreferenceKeys, stringId: Int) {
            val text = requireActivity().getString(stringId)
            preferenceManager.findPreference<Preference>(preferenceKey.value)!!.summary = text
        }
    }

    companion object {
        val SETTINGS_AUTOFILL_REQUEST: Int = 1
    }
}