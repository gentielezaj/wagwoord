package me.gentielezaj.wagwoord.fragments.totp

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.CoreFragmentList
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.fragments.passwords.PasswordViewModel
import me.gentielezaj.wagwoord.fragments.util.CoreRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.injectEntityService

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [TotpListFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [TotpListFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class TotpListFragment : CoreFragmentList<Totp>() {

    override val entityService: CoreEntityService<Totp> by injectEntityService<Totp>()
    override val viewModel: TotpViewModel by activityViewModels()

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment TotpListFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            TotpListFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
