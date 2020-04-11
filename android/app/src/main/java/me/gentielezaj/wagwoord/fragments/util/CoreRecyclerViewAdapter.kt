package me.gentielezaj.wagwoord.fragments.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity

open class CoreRecyclerViewAdapter<TModel : IEntity>() :
    RecyclerView.Adapter<MyViewHolder>() {

    private lateinit var dataSet: List<TModel>
    private var listItemFragmentId: Int = 0
    private lateinit var onBindViewHolderFun:(holder: MyViewHolder, position: Int) -> TModel?
    private var viewValueMap: List<ViewValueMap<*>>? = null

    constructor(dataSet: List<TModel>, listItemFragmentId: Int, onBindViewHolderFun:(holder: MyViewHolder, position: Int) -> TModel?) : this(dataSet, listItemFragmentId) {
        this.onBindViewHolderFun = onBindViewHolderFun
    }

    constructor(dataSet: List<TModel>, listItemFragmentId: Int, viewValueMap: List<ViewValueMap<*>>): this(dataSet, listItemFragmentId) {
        this.viewValueMap = viewValueMap
    }

    private  constructor(dataSet: List<TModel>, listItemFragmentId: Int) : this() {
        this.dataSet = dataSet.toMutableList()
        this.listItemFragmentId = listItemFragmentId
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        val listItem = layoutInflater.inflate(listItemFragmentId, parent, false)
        return MyViewHolder(listItem)
    }

    override fun getItemCount(): Int {
        return  dataSet.size
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        if(viewValueMap != null) {
            TODO("set this shit up")
        } else {
            onBindViewHolderFun(holder, position)
        }
    }

    fun updateData(data: List<TModel>) {
        dataSet = data
        notifyDataSetChanged()
    }

}

data class ViewValueMap<TView: View>(val viewId: Int, val viewType: Class<TView>, val property: String) {
    fun getView(holder: MyViewHolder) : TView {
        return holder.findViewById<TView>(viewId)
    }
}

class MyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    fun findViewById(id: Int) : View {
        return itemView.findViewById(id)
    }

    fun <T> findViewById(id: Int) : T {
        return  this.findViewById(id) as T
    }
}