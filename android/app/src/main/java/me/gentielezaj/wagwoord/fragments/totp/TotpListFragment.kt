package me.gentielezaj.wagwoord.fragments.totp

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.CoreFragment
import me.gentielezaj.wagwoord.fragments.util.CoreRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Totp

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
class TotpListFragment : CoreFragment(R.layout.fragment_totp_list) {
    private lateinit var recyclerView: RecyclerView
    private lateinit var viewAdapter: CoreRecyclerViewAdapter<Totp>
    private lateinit var viewManager: RecyclerView.LayoutManager
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    private val dataSet: MutableList<Totp> = mutableListOf(
        Totp().apply {
            username = "userName"
            issuer = "issuer"
        }
    )

    init {
        for(i in 1..40) {
            dataSet.add(Totp().apply {
                username = "userName$i"
                issuer = "issuer$i"
            })
        }

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var view = super.onCreateView(inflater, container, savedInstanceState)

        viewAdapter = CoreRecyclerViewAdapter<Totp>(
            dataSet,
            R.layout.fragment_totp_list_item,
            { myViewHolder: MyViewHolder, i: Int -> onBindViewHolder(myViewHolder, i) })

        viewManager = LinearLayoutManager(context);
        swipeRefreshLayout = view!!.findViewById(R.id.swipeRefreshLayoutTotp)
        swipeRefreshLayout.setOnRefreshListener {
            //refresh()
            swipeRefreshLayout.isRefreshing = false;
        };

        recyclerView = view!!.findViewById<RecyclerView>(R.id.my_recycler_view)
        recyclerView.apply {
            // use this setting to improve performance if you know that changes
            // in content do not change the layout size of the RecyclerView
            setHasFixedSize(true)

            // use a linear layout manager
            layoutManager = viewManager

            // specify an viewAdapter (see also next example)
            adapter = viewAdapter

        }

        return view;
    }

    fun onBindViewHolder(holder: MyViewHolder, position: Int): Totp? {
        val item = dataSet[position];

        val imageView: ImageView = holder.findViewById<ImageView>(R.id.totp_list_item_image)
        if (item.icon.isNullOrEmpty()) {
            imageView.visibility = View.INVISIBLE
        }

        holder.findViewById<TextView>(R.id.totp_list_item_issuer).text = item.issuer
        holder.findViewById<TextView>(R.id.totp_list_item_username).text = item.username

        return null;
    }

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
