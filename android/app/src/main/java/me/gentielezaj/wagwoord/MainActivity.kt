package me.gentielezaj.wagwoord

import android.app.SearchManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.EditText
import android.widget.LinearLayout
import androidx.activity.viewModels
import androidx.appcompat.widget.SearchView
import androidx.appcompat.widget.Toolbar
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.OnOffsetChangedListener
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.activities.auth.LoginActivity
import me.gentielezaj.wagwoord.activities.auth.RequestAutofillPermissionActivity
import me.gentielezaj.wagwoord.activities.settings.SettingsActivity
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LogData
import me.gentielezaj.wagwoord.common.ServerStatus
import me.gentielezaj.wagwoord.common.empty
import me.gentielezaj.wagwoord.services.BackgroundService
import me.gentielezaj.wagwoord.services.dependencyInjection.bindView
import me.gentielezaj.wagwoord.services.dependencyInjection.inject
import me.gentielezaj.wagwoord.viewModels.SearchViewModel


class MainActivity : CoreActivity() {

    private val appService: BackgroundService by inject()
    private val toolbar by bindView<Toolbar>(R.id.toolbar)
    private val appBar by bindView<AppBarLayout>(R.id.app_bar)
    private val collapsingToolbarLayout by bindView<CollapsingToolbarLayout>(R.id.collapsing_toolbar)
    private val collapsingToolbarActions by bindView<LinearLayout>(R.id.collapsing_toolbar_actions)
    private val navView: BottomNavigationView by bindView(R.id.nav_view)
    private lateinit var navController: NavController
    private lateinit var searchView: SearchView
    private lateinit var searchMenuItem: MenuItem
    private var isAppBarExpended = true
    private val searchViewModel: SearchViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        checkIfAppIsSetup()
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // region toolbar
        setSupportActionBar(toolbar)
        // endregion toolbar

        // region navigation
        navController = findNavController(R.id.nav_host_fragment)
        navController.addOnDestinationChangedListener { controller, destination, arguments ->
            changeTitle(destination.label.toString())
        }

        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_totp,
                R.id.navigation_password,
                R.id.navigation_creditcard,
                R.id.navigation_address,
                R.id.navigation_demo
            )
        )

        navView.setupWithNavController(navController)
        setupActionBarWithNavController(navController, appBarConfiguration)

        // endregion navigation
    }

    private fun changeTitle(title: String?): Boolean {
        collapsingToolbarLayout.title = title ?: navView.menu.findItem(navView.selectedItemId).title
        appBar.setExpanded(true, true)
        return true
    }

    private fun checkIfAppIsSetup() {
        appService.onStart()
        val isSetup = localStorage.get(Constants.LocalStorageKeys.APP_IS_SETUP, false)
        val isError = localStorage.get(Constants.LocalStorageKeys.SERVER_STATUS, ServerStatus.OFF) == ServerStatus.ERROR

        if (isSetup && !isError) return

        if (!isSetup && !isPermissionGranted(android.Manifest.permission.BIND_AUTOFILL_SERVICE)) {
            val intent = Intent(this, RequestAutofillPermissionActivity::class.java)
            intent.putExtra(RequestAutofillPermissionActivity.CONTINUE_TO_LOGIN, true)
            startActivity(intent)
        } else startActivity(Intent(this, LoginActivity::class.java))
    }

    // region toolbar

    private fun onOffsetChanged(appBarLayout: AppBarLayout, verticalOffset: Int) {
        LogData("height: ${appBarLayout.height}, bootom: ${appBarLayout.bottom}, offset: $verticalOffset, toolbar: ${toolbar.height}")
        if ((toolbar.height * 2) > (appBarLayout.height - appBarLayout.bottom)) {
            collapsingToolbarActions.alpha = 1f
            findViewById<View>(R.id.action_search).alpha = 0f
            findViewById<View>(R.id.action_settings).alpha = 0f
        } else {
            val percent = (toolbar.height * 2f) / (appBarLayout.bottom * 2)
            LogData("procent: $percent")
            collapsingToolbarActions.alpha = 1 - percent
            findViewById<View>(R.id.action_search).alpha = percent
            findViewById<View>(R.id.action_settings).alpha = percent
        }
        isAppBarExpended = if (appBarLayout.height - appBarLayout.bottom == 0) {
            closeSearchAndKeyBoard()
            true
        } else {
            false
        }
    }
    // endregion toolbar

    // region menu
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.toolbar_menu, menu)
        searchMenuItem = menu.findItem(R.id.action_search)
        searchMenuItem.setOnMenuItemClickListener {
            appBar.setExpanded(false, true)
            true
        }

        searchView = searchMenuItem.actionView as SearchView
        //searchView.maxWidth = Int.MAX_VALUE
        //searchView.setOnCloseListener { true }
        val searchPlate = searchView.findViewById(androidx.appcompat.R.id.search_src_text) as EditText
        searchPlate.hint = "Search"

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                closeKeyboard()
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                searchViewModel.setText(newText ?: String.empty)
                return true
            }
        })

        val searchManager =
            getSystemService(Context.SEARCH_SERVICE) as SearchManager
        searchView.setSearchableInfo(searchManager.getSearchableInfo(componentName))

        appBar.addOnOffsetChangedListener(OnOffsetChangedListener { appBarLayout, verticalOffset ->
            onOffsetChanged(appBarLayout, verticalOffset)
        })

        return super.onCreateOptionsMenu(menu)
    }

    private fun closeSearchAndKeyBoard() {
        if (!searchView.isIconified && !isAppBarExpended) {
            searchView.onActionViewCollapsed()
            searchMenuItem.collapseActionView()
            closeKeyboard()
        }
    }

    override fun onBackPressed() {
        if (!searchView.isIconified) {
            searchView.onActionViewCollapsed()
        } else {
            super.onBackPressed()
        }
    }

    // region open settings
    fun openSettings(item: MenuItem) = openSettings()
    fun openSettings(view: View) = openSettings()
    fun openSearch(view: View) {
        appBar.setExpanded(false, true)
        searchMenuItem.expandActionView()
    }

    private fun openSettings() = startActivity(Intent(this, SettingsActivity::class.java))
    // endregion open settings
    // endregion menu
}
