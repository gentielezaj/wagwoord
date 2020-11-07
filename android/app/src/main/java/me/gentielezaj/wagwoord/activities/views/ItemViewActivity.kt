package me.gentielezaj.wagwoord.activities.views

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.FragmentContainerView
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.fragments.totp.TotpItemFragment
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.dependencyInjection.bindView
import kotlin.reflect.KClass

private const val IntentExtraId = "ItemId"

class ItemViewActivity : CoreActivity() {

    val fragmentContainer: FragmentContainerView by bindView(R.id.fragment_container_view_item_view)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_item_view)
        val id = intent.getIntExtra(IntentExtraId, 0);
        if(id == 0) startActivity(Intent(this, MainActivity::class.java))

//        supportFragmentManager.commit {
//            add(R.id.fragment_container_view_item_view, TotpItemFragment.newInstance(id), "item")
//        }

        supportFragmentManager.beginTransaction().add(R.id.fragment_container_view_item_view, TotpItemFragment.newInstance(id), "item").commit()
    }

    companion object {
        inline fun <reified T : IEntity> open(context: Context, id: Int) : Intent = open(context, id, T::class)

        fun <T : IEntity> open(context: Context, id: Int, cl: KClass<T>) : Intent {
            val intent = Intent(context, ItemViewActivity::class.java)
            intent.putExtra(IntentExtraId, id)
            return intent
        }
    }
}