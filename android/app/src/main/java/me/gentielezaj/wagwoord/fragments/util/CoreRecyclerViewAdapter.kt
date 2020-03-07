package me.gentielezaj.wagwoord.fragments.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity

open class CoreRecyclerViewAdapter<TModel : IEntity>() :
    RecyclerView.Adapter<MyViewHolder>() {

    private lateinit var dataSet: Array<TModel>
    private var listItemFragmentId: Int = 0
    private lateinit var onBindViewHolderFun:(holder: MyViewHolder, position: Int) -> TModel?
    private var viewValueMap: Array<ViewValueMap<*>>? = null

    constructor(dataSet: Array<TModel>, listItemFragmentId: Int, onBindViewHolderFun:(holder: MyViewHolder, position: Int) -> TModel?) : this(dataSet, listItemFragmentId) {
        this.onBindViewHolderFun = onBindViewHolderFun
    }

    constructor(dataSet: Array<TModel>, listItemFragmentId: Int, viewValueMap: Array<ViewValueMap<*>>): this(dataSet, listItemFragmentId) {
        this.viewValueMap = viewValueMap
    }

    private  constructor(dataSet: Array<TModel>, listItemFragmentId: Int) : this() {
        this.dataSet = dataSet
        this.listItemFragmentId = listItemFragmentId
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        var layoutInflater = LayoutInflater.from(parent.getContext());
        var listItem = layoutInflater.inflate(listItemFragmentId, parent, false)
        var viewHolder = MyViewHolder(listItem)
        return  viewHolder;
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