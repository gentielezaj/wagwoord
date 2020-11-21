package me.gentielezaj.wagwoord.fragments.core

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.databinding.ViewDataBinding
import com.wada811.databinding.dataBinding
import kotlinx.coroutines.runBlocking
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.dependencyInjection.injectEntityService
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import kotlin.reflect.KClass

interface ICoreItemFragment

abstract class CoreItemFragment<T : IEntity, TBiding: ViewDataBinding>(fragmentLayoutId: Int, private val itemId: Int, private val entity: KClass<T>) : CoreFragment(fragmentLayoutId), ICoreItemFragment {
    private val service: CoreEntityService<T> by injectEntityService(entity)
    lateinit var model: T
    protected val binding: TBiding by dataBinding()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        var item: T? = null
        runBlocking {
            item = service.item(itemId)
        }

        if (item == null) {
            requireActivity().startActivity(Intent(context, MainActivity::class.java))
            return
        }

        model = item!!;
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        bind()
    }

    protected abstract fun bind()
}