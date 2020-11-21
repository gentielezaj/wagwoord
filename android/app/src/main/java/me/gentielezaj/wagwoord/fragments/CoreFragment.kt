package me.gentielezaj.wagwoord.fragments
import android.content.Context
import android.net.Uri
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.DividerItemDecoration.VERTICAL
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import me.gentielezaj.wagwoord.MainActivity
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.AppUtil
import me.gentielezaj.wagwoord.fragments.util.BaseRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.CoreRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.viewModels.CoreListViewModel
import me.gentielezaj.wagwoord.viewModels.SearchViewModel

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
abstract class CoreFragment(val fragmentLayoutId: Int?) : Fragment() {
    constructor() : this(null)
    // TODO: Rename and change types of parameters
    protected var param1: String? = null
    protected var param2: String? = null
    protected var listener: OnFragmentInteractionListener? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        if(fragmentLayoutId != null)
            return inflater.inflate(fragmentLayoutId, container, false)

        return null;
    }

    fun run(statement: suspend () -> Unit) {
        GlobalScope.launch(Dispatchers.Main) {
            statement()
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }
}

abstract class BaseFragmentList<T: IEntity, TViewHodler: MyViewHolder<T>>(fragmentListLayoutId: Int = R.layout.fragment_core_list, val fragmentListItemLayoutId: Int = R.layout.fragment_core_list_item)
    : CoreFragment(fragmentListLayoutId) {
    protected lateinit var recyclerView: RecyclerView
    protected lateinit var viewAdapter: BaseRecyclerViewAdapter<T, TViewHodler>
    protected lateinit var viewManager: RecyclerView.LayoutManager
    protected lateinit var swipeRefreshLayout: SwipeRefreshLayout
    protected abstract val entityService: CoreEntityService<T>
    protected val searchViewModel: SearchViewModel by activityViewModels<SearchViewModel>()

    protected abstract val viewModel: CoreListViewModel<T>
    protected var dataSet: List<T> = listOf<T>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var view = super.onCreateView(inflater, container, savedInstanceState)!!

        viewAdapter = adapter()

        viewManager = LinearLayoutManager(context);
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayoutList)
        swipeRefreshLayout.setOnRefreshListener {
            // refresh()
            run {
                getData(null, true)
                swipeRefreshLayout.isRefreshing = false;
            }
        };

        recyclerView = view.findViewById<RecyclerView>(R.id.core_recycler_view_list)
        recyclerView.apply {
            // use this setting to improve performance if you know that changes
            // in content do not change the layout size of the RecyclerView
            setHasFixedSize(true)

            // use a linear layout manager
            layoutManager = viewManager

            // specify an viewAdapter (see also next example)
            adapter = viewAdapter
        }

        recyclerView.addItemDecoration(DividerItemDecoration(context, VERTICAL))

        viewModel.data.observe(this as LifecycleOwner, Observer { data ->
            updateData(data)
        })

        searchViewModel.searchText.observe(this as LifecycleOwner, Observer { data ->
            data(data, false)
        })

        run {
            viewModel.setData(entityService.list())
        }

        return view;
    }

    fun data(searchText: String?, sync: Boolean = false) = AppUtil.launch { getData(searchText, sync) }

    protected suspend fun getData(searchText: String?, sync: Boolean) {
        if(sync && entityService.hasInternetConnectionAndServerSet()) {
            if(entityService.syncLocal()) {
                Toast.makeText(context, getString(R.string.data_updated), Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, getString(R.string.data_updated_failed), Toast.LENGTH_SHORT).show()
            }
        }

        val d = entityService.list(searchText)
        viewModel.setData(d)
    }

    abstract fun adapter() : BaseRecyclerViewAdapter<T, TViewHodler>

    protected open fun updateData(data: List<T>) {
        dataSet = data
        viewAdapter.updateData(dataSet)
    }
}

abstract class CoreFragmentList<TEntity: IEntity>(fragmentListLayoutId: Int = R.layout.fragment_core_list, fragmentListItemLayoutId: Int = R.layout.fragment_core_list_item)
    : BaseFragmentList<TEntity, MyViewHolder<TEntity>>(fragmentListLayoutId, fragmentListItemLayoutId) {

    override fun adapter() : BaseRecyclerViewAdapter<TEntity, MyViewHolder<TEntity>> {
        return CoreRecyclerViewAdapter<TEntity>(
            dataSet,
            fragmentListItemLayoutId)
    }
}