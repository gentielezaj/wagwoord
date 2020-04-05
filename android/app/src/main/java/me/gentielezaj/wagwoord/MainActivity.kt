package me.gentielezaj.wagwoord

import android.app.Activity
import android.app.SearchManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.DisplayMetrics
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import androidx.appcompat.widget.SearchView
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.OnOffsetChangedListener
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.activities.auth.LoginActivity
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.fragments.OnFragmentInteractionListener
import me.gentielezaj.wagwoord.services.bindView


class MainActivity : CoreActivity(), OnFragmentInteractionListener {

    private val toolbar by bindView<Toolbar>(R.id.toolbar)
    private val appBar by bindView<AppBarLayout>(R.id.app_bar)
    private lateinit var searchView: SearchView
    private lateinit var searchMenuItem: MenuItem
    private var isAppBarExpended = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkIfAppIsSetup()
        setContentView(R.layout.activity_main)

        // region toolbar
        setSupportActionBar(toolbar)
        // endregion toolbar

        // region navigation
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_totp,
                R.id.navigation_password,
                R.id.navigation_creditcard,
                R.id.navigation_address,
                R.id.navigation_demo
            )
        )

        val navView: BottomNavigationView = findViewById(R.id.nav_view)
        val navController = findNavController(R.id.nav_host_fragment)
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
        // endregion navigation
    }

    private fun checkIfAppIsSetup() {
        if (!LocalStorage.get<Boolean>(this, Constants.LocalStorageKeys.APP_IS_SETUP, false)) {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }

    override fun onFragmentInteraction(uri: Uri) {}

    // region menu
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.toolbar_menu, menu)
        searchMenuItem = menu.findItem(R.id.action_search)
        if (searchMenuItem != null) {
            searchMenuItem.setOnMenuItemClickListener {
                appBar.setExpanded(false, true)
                true
            }

            searchView = searchMenuItem.getActionView() as SearchView
            //searchView.setOnCloseListener { true }
            val searchPlate =
                searchView.findViewById(androidx.appcompat.R.id.search_src_text) as EditText
            searchPlate.hint = "Search"
            val searchPlateView: View =
                searchView.findViewById(androidx.appcompat.R.id.search_plate)

            searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
                override fun onQueryTextSubmit(query: String?): Boolean {
                    closeKeyboard()
                    return false
                }

                override fun onQueryTextChange(newText: String?): Boolean {
                    return false
                }
            })

            val searchManager =
                getSystemService(Context.SEARCH_SERVICE) as SearchManager
            searchView.setSearchableInfo(searchManager.getSearchableInfo(componentName))
        }

        appBar.addOnOffsetChangedListener(OnOffsetChangedListener { appBarLayout, verticalOffset ->
            isAppBarExpended = if (appBarLayout.height - appBarLayout.bottom == 0) {
                closeSearchAndKeyBoard()
                true
            } else {
                false
            }
        })

        return super.onCreateOptionsMenu(menu)
    }

    fun closeKeyboard() {
        val imm: InputMethodManager =
            getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
        val view: View = currentFocus ?: View(this)
        imm.hideSoftInputFromWindow(view.applicationWindowToken, 0)
    }

    fun closeSearchAndKeyBoard() {
        if (!searchView.isIconified && !isAppBarExpended) {
            searchView.onActionViewCollapsed();
            searchMenuItem.collapseActionView()

            closeKeyboard()
        }
    }

    override fun onBackPressed() {
        if (!searchView.isIconified) {
            searchView.onActionViewCollapsed();
        } else {
            super.onBackPressed();
        }
    }
    // endregion menu
}
