package me.gentielezaj.wagwoord.fragments.demo

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.services.BackgroundService

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [DemoFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [DemoFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class DemoFragment : CoreFragment(R.layout.fragment_demo) {
    lateinit var backgroundService :BackgroundService

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = super.onCreateView(inflater, container, savedInstanceState)!!

        val button = view.findViewById<Button>(R.id.demo_clear_storage)
        val con = requireContext();
        backgroundService = BackgroundService(con)
        view.findViewById<Button>(R.id.demo_open_activity).setOnClickListener { v: View ->
            GlobalScope.launch(Dispatchers.Main) {
                backgroundService.sync()
            }
        }

        button.setOnClickListener { v: View? ->
            run {
                var sp = requireContext().getSharedPreferences(
                    Constants.LocalStorageKeys.SHARED_PREFERENCES,
                    Context.MODE_PRIVATE
                );
                with(sp.edit()) {
                    clear()
                    commit()
                }
            }
        }

        return view;
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment DemoFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            DemoFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
