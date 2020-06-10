package me.gentielezaj.wagwoord.fragments.creditcards

import android.os.Bundle
import android.widget.TextView
import androidx.fragment.app.activityViewModels
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.CoreFragmentList
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.CreditCard
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.injectEntityService

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [CreditcardListFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [CreditcardListFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class CreditCardListFragment : CoreFragmentList<CreditCard>() {

    protected override val entityService: CoreEntityService<CreditCard> by injectEntityService<CreditCard>()
    protected override val viewModel: CreditCardViewModel by activityViewModels()

    override fun onBindViewHolder(holder: MyViewHolder, position: Int): CreditCard? {
        val item = dataSet[position];

        var subject = item.name;
        if(!item.bank.isNullOrEmpty()) subject += " (${item.bank})"

        val description = "${item.cardType} **** ${item.cardNumber.substring(item.cardNumber.length - 4)}"

        holder.findViewById<TextView>(R.id.core_list_item_subject).text = subject
        holder.findViewById<TextView>(R.id.core_list_item_description).text = description

        return item;
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment AddressListFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            CreditCardListFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
