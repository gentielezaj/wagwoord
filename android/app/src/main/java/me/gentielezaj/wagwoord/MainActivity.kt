package me.gentielezaj.wagwoord

import android.content.Intent
import android.net.Uri
import android.opengl.Visibility
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.EditText
import androidx.navigation.findNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.gentielezaj.wagwoord.activities.configuration.SetupActivity
import me.gentielezaj.wagwoord.fragments.OnFragmentInteractionListener

class MainActivity : AppCompatActivity(), OnFragmentInteractionListener {

    lateinit var searchEditText: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val navView: BottomNavigationView = findViewById(R.id.nav_view)
        val navController = findNavController(R.id.nav_host_fragment)
        navView.setupWithNavController(navController)

        searchEditText = findViewById(R.id.app_toolbar_search_edit_text)
        searchEditText.addTextChangedListener(SearchTextWatcher(findViewById(R.id.app_toolbar_search_edit_text_remove)))

    }

    class SearchTextWatcher(val button: View) : android.text.TextWatcher {
        override fun afterTextChanged(s: Editable?) {
        }

        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        }

        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            if(s.isNullOrEmpty()) button.visibility = View.INVISIBLE
            else button.visibility = View.VISIBLE
        }
    }


    override fun onFragmentInteraction(uri: Uri) {}
    fun resetSearch(view: View) {
        searchEditText.text.clear();
    }

    fun settingActivity(view: View) {
        startActivity(Intent(this, SetupActivity::class.java))
    }

}
