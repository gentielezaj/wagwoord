package me.gentielezaj.wagwoord.fragments.totp

import android.content.Intent
import android.os.Bundle
import android.view.View
import com.wada811.databinding.dataBinding
import kotlinx.coroutines.runBlocking
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.databinding.TotpItemFragmentBinding
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.services.dependencyInjection.injectEntityService

private const val ARG_ItemId = "ItemId"

class TotpItemFragment : CoreFragment(R.layout.fragment_totp_item) {
    private val service by injectEntityService<Totp>()
    lateinit var model: Totp
    private var itemId: Int = 0
    private val binding: TotpItemFragmentBinding by dataBinding()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            itemId = it.getInt(ARG_ItemId, 0)
        }
        var item: Totp? = null
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
        binding.data = model
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment TotpItemFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(id: Int) =
            TotpItemFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_ItemId, id ?: 0)
                }
            }
    }
}