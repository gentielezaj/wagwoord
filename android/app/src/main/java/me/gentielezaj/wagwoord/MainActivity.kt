package me.gentielezaj.wagwoord

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.widget.Toolbar
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.activities.auth.LoginActivity
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.fragments.OnFragmentInteractionListener
import me.gentielezaj.wagwoord.services.bindView
import androidx.navigation.ui.setupActionBarWithNavController

class MainActivity : CoreActivity(), OnFragmentInteractionListener {

    private val toolbar by bindView<Toolbar>(R.id.toolbar)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkIfAppIsSetup()
        setContentView(R.layout.activity_main)

        // region toolbar
        setSupportActionBar(toolbar)
        // endregion toolbar

        // region navigation
        val appBarConfiguration = AppBarConfiguration(
            setOf(R.id.navigation_totp, R.id.navigation_password, R.id.navigation_creditcard,R.id.navigation_address, R.id.navigation_demo)
        )

        val navView: BottomNavigationView = findViewById(R.id.nav_view)
        val navController = findNavController(R.id.nav_host_fragment)
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
        // endregion navigation
    }

    private fun checkIfAppIsSetup() {
        if(!LocalStorage.get<Boolean>(this, Constants.LocalStorageKeys.APP_IS_SETUP, false)) {
            startActivity(Intent(this,  LoginActivity::class.java))
        }
    }

    override fun onFragmentInteraction(uri: Uri) {}
}
