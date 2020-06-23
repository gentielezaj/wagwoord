package me.gentielezaj.wagwoord.fragments.util

import android.app.PendingIntent.getActivity
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.core.content.ContextCompat.startActivity
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.views.generic.GenericViewActivity
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.annotations.getListDataText
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.IIdEntity


open class CoreRecyclerViewAdapter<TModel : IEntity>() :
    RecyclerView.Adapter<MyViewHolder>() {

    private lateinit var dataSet: List<TModel>
    private var listItemFragmentId: Int = 0
    private lateinit var onBindViewHolderFun:(holder: MyViewHolder, position: Int) -> TModel?
    private var hasBinder = false
    private var viewValueMap: List<ViewValueMap<*>>? = null

    constructor(dataSet: List<TModel>, listItemFragmentId: Int, onBindViewHolderFun:(holder: MyViewHolder, position: Int) -> TModel?) : this(dataSet, listItemFragmentId) {
        this.onBindViewHolderFun = onBindViewHolderFun
        hasBinder = true
    }

    constructor(dataSet: List<TModel>, listItemFragmentId: Int, viewValueMap: List<ViewValueMap<*>>): this(dataSet, listItemFragmentId) {
        this.viewValueMap = viewValueMap
    }

    constructor(dataSet: List<TModel>, listItemFragmentId: Int) : this() {
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
        when {
            viewValueMap != null -> {
                TODO("set this shit up")
            }
            hasBinder -> {
                onBindViewHolderFun(holder, position)
            }
            else -> {
                val item = dataSet[position]
                holder.findViewById<TextView>(R.id.core_list_item_subject).text = getListDataText(item, ListDataTypes.Subject)
                holder.findViewById<TextView>(R.id.core_list_item_description).text = getListDataText(item, ListDataTypes.Description)
                holder.findViewById<TextView>(R.id.core_list_item_expand_content_primary).text = getListDataText(item, ListDataTypes.ExpandPrimary)
                holder.findViewById<TextView>(R.id.core_list_item_expand_content_secondary).text = getListDataText(item, ListDataTypes.ExpandSecondary)

                holder.findViewById<ImageView>(R.id.core_list_item_expand).setOnClickListener {
                    holder.toggle()
                }

                holder.bind(item)
            }
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

    fun toggle() {
        val view = findViewById<RelativeLayout>(R.id.core_list_item_expand_content)
        view.visibility = if(view.visibility == View.GONE) View.VISIBLE else View.GONE
    }

    fun bind(item: IIdEntity) {
        itemView.setOnClickListener {
            val intent = Intent(itemView.context, GenericViewActivity::class.java)
            intent.putExtra("id", item.id)
            itemView.context.startActivity(intent)
        }
    }
}