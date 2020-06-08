package me.gentielezaj.wagwoord.fragments.addresses

import android.os.Bundle
import android.widget.TextView
import androidx.fragment.app.activityViewModels
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.CorFragmentList
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Address
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.injectEntityService

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [AddressListFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [AddressListFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class AddressListFragment : CorFragmentList<Address>() {

    protected override val entityService: CoreEntityService<Address> by injectEntityService<Address>()
    protected override val viewModel: AddressViewModel by activityViewModels()

    override fun onBindViewHolder(holder: MyViewHolder, position: Int): Address? {
        val item = dataSet[position];

        holder.findViewById<TextView>(R.id.core_list_item_subject).text = "${item.firstName} ${item.lastName} - ${item.username}"
        holder.findViewById<TextView>(R.id.core_list_item_description).text = "${item.street} ${item.city}"

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
            AddressListFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
