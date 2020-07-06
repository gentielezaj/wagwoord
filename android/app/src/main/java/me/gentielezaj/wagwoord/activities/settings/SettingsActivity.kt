package me.gentielezaj.wagwoord.activities.settings

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.activities.auth.LoginActivity

class SettingsActivity : CoreActivity() {

    lateinit var loginPreference: Preference;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.settings_activity)
        supportFragmentManager
            .beginTransaction()
            .replace(R.id.settings, SettingsFragment())
            .commit()
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    class SettingsFragment : PreferenceFragmentCompat() {

        override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey)
            val loginPreference = preferenceManager.findPreference<Preference>("open_login")!!;
            loginPreference.setOnPreferenceClickListener {
                val intent = Intent(activity, LoginActivity::class.java)
                intent.putExtra(LoginActivity.HIDE_SKIP_BUTTON_KEY, true)
                startActivity(intent)
                true
            }
        }
    }
}