package me.gentielezaj.wagwoord

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.navigation.findNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.gentielezaj.wagwoord.activities.auth.LoginActivity
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.fragments.OnFragmentInteractionListener

class MainActivity : AppCompatActivity(), OnFragmentInteractionListener {

    private lateinit var appBarLayout: AppBarLayout
    private lateinit var appCollapsingToolbarLayout: CollapsingToolbarLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        chackIfAppIsSteup()
        setContentView(R.layout.activity_main)

        val navView: BottomNavigationView = findViewById(R.id.nav_view)

        val navController = findNavController(R.id.nav_host_fragment)

        navView.setupWithNavController(navController)
    }

    fun chackIfAppIsSteup() {
        if(!LocalStorage.get<Boolean>(this, Constants.LocalStorageKeys.APP_IS_SETUP, false)) {
            startActivity(Intent(this,  LoginActivity::class.java))
        }
    }

    fun onScroll() {
    }

    override fun onFragmentInteraction(uri: Uri) {}

    fun setupFirstUse() {

    }

}
