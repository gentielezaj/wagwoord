package me.gentielezaj.wagwoord.fragments.addresses

import android.os.Bundle
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.CoreFragment

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
class AddressListFragment : CoreFragment(R.layout.fragment_address_list) {

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
