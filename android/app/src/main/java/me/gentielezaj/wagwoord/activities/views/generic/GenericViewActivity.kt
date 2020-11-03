package me.gentielezaj.wagwoord.activities.views.generic

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.databinding.Bindable
import androidx.databinding.BindingMethod
import androidx.databinding.DataBindingUtil
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.CoreActivity
import me.gentielezaj.wagwoord.common.empty
import me.gentielezaj.wagwoord.databinding.ActivityMainBinding
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.bindView
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.entity.CoreService
import me.gentielezaj.wagwoord.services.entity.TotpService
import me.gentielezaj.wagwoord.services.inject
import kotlin.math.log
import kotlin.reflect.KClass

abstract class GenericViewActivity<TModel : IEntity, TService: CoreEntityService<TModel>>(private val layoutId: Int = R.layout.activity_generic_view) : CoreActivity() {
    var id:Int = 0
    lateinit var model:TModel
    abstract val repository: TService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        init();
        // setContentView(layoutId)
    }

    private fun init() {
        id = intent.getIntExtra(IntentExtraId, 0);
        if(id == 0) startActivity(Intent(this, MainActivity::class.java))
        val activity = this;
        launch {
            model = repository.item(id)!!
            val binding : ActivityMainBinding = DataBindingUtil.setContentView(activity, layoutId)
            binding.model = model
        }
    }

    companion object {
        private const val IntentExtraId = "Id"
        private val resolver = mapOf<KClass<*>, KClass<*>>(Totp::class to TotpViewActivity::class)

        inline fun <reified T : IEntity> open(context: Context, id: Int) : Intent = open(context, id, T::class)

        fun <T : IEntity> open(context: Context, id: Int, cl: KClass<T>) : Intent {
            val intent = Intent(context, resolver[cl]!!.java)
            intent.putExtra(IntentExtraId, id)
            return intent
        }
    }
}

class TotpViewActivity : GenericViewActivity<Totp, TotpService>() {
    override val repository by inject<TotpService>()
}