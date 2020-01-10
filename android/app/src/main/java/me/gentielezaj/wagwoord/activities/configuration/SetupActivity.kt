package me.gentielezaj.wagwoord.activities.configuration

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import me.gentielezaj.wagwoord.R

class SetupActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setup)
    }

    fun skip(view: View) {}
    fun setup(view: View) {}
}
