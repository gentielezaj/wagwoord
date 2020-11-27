package me.gentielezaj.wagwoord.activities.views

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.widget.LinearLayout
import androidx.activity.viewModels
import androidx.appcompat.widget.SearchView
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.FragmentContainerView
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.bottomnavigation.BottomNavigationView
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.fragments.core.CoreItemFragment
import me.gentielezaj.wagwoord.fragments.totp.TotpItemFragment
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.BackgroundService
import me.gentielezaj.wagwoord.services.dependencyInjection.DI
import me.gentielezaj.wagwoord.services.dependencyInjection.DIEntityModel
import me.gentielezaj.wagwoord.services.dependencyInjection.bindView
import me.gentielezaj.wagwoord.services.dependencyInjection.inject
import me.gentielezaj.wagwoord.viewModels.SearchViewModel
import kotlin.reflect.KClass

private const val IntentExtraId = "ItemId"
private const val IntentExtraType = "ItemType"

class ItemViewActivity<T: IEntity> : CoreActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_item_view)
        val id = intent.getIntExtra(IntentExtraId, 0);
        val key = intent.getStringExtra(IntentExtraType);
        if(id == 0 || key.isNullOrEmpty()) startActivity(Intent(this, MainActivity::class.java))

        supportFragmentManager.beginTransaction().add(R.id.fragment_container_view_item_view, DI.view(key, id), "item").commit()
        title = key
    }

    companion object {
        inline fun <reified T : IEntity> open(context: Context, id: Int) : Intent = open(context, id, T::class)

        fun <T : IEntity> open(context: Context, id: Int, cl: KClass<T>) : Intent {
            val intent = Intent(context, ItemViewActivity::class.java)
            intent.putExtra(IntentExtraId, id)
            val entityKey = DI.registry.first{it is DIEntityModel && it.entity == cl}.key
            intent.putExtra(IntentExtraType, entityKey)
            return intent
        }
    }
}