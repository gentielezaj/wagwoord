package me.gentielezaj.wagwoord.activities.views.generic

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.services.bindView

class GenericViewActivity : CoreActivity() {

    val textView: TextView by bindView(R.id.textView)
    var id:Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_generic_view)

        init();
    }

    private fun init() {
        id = intent.getIntExtra("id", 0);
        if(id == 0) startActivity(Intent(this, MainActivity::class.java))
        textView.text = id.toString();
    }
}