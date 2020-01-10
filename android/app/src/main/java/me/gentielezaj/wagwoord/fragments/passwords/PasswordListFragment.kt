package me.gentielezaj.wagwoord.fragments.passwords

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
 * [PasswordListFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [PasswordListFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class PasswordListFragment : CoreFragment(R.layout.fragment_password_list) {

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment PasswordListFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            PasswordListFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
