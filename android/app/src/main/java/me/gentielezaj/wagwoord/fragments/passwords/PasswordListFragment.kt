package me.gentielezaj.wagwoord.fragments.passwords

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.CorFragmentList
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.fragments.addresses.AddressViewModel
import me.gentielezaj.wagwoord.fragments.util.CoreRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.inject
import me.gentielezaj.wagwoord.services.injectEntityService
import me.gentielezaj.wagwoord.viewModels.CoreViewModel

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
class PasswordListFragment : CorFragmentList<Password>() {

    protected override val entityService: CoreEntityService<Password> by injectEntityService<Password>()
    protected override val viewModel: PasswordViewModel by activityViewModels()

    override fun onBindViewHolder(holder: MyViewHolder, position: Int): Password? {
        val item = dataSet[position];

        holder.findViewById<TextView>(R.id.core_list_item_subject).text = item.username
        holder.findViewById<TextView>(R.id.core_list_item_description).text = item.name

        return item;
    }

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
