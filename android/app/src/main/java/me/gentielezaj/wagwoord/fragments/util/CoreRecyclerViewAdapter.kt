package me.gentielezaj.wagwoord.fragments.util

import android.app.AlertDialog
import android.content.*
import android.view.*
import android.view.View.OnLongClickListener
import android.widget.ImageView
import android.widget.RelativeLayout
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.views.generic.GenericViewActivity
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.annotations.getListDataText
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.IIdEntity
import me.gentielezaj.wagwoord.ui.ListMenuBottomSheetDialog
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties


open class CoreRecyclerViewAdapter<TModel : IEntity>() :
    RecyclerView.Adapter<MyViewHolder>() {

    protected lateinit var dataSet: List<TModel>
    private var listItemFragmentId: Int = 0
    private var viewValueMap: List<ViewValueMap<*>>? = null

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

    protected open fun mapBindView (item: TModel) : Map<ListDataTypes, String> = getListDataText(item)

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val item = dataSet[position]
        var map = mapBindView(item)
        holder.findViewById<TextView>(R.id.core_list_item_subject).text = map[ListDataTypes.Subject]
        holder.findViewById<TextView>(R.id.core_list_item_description).text = map[ListDataTypes.Description]

        if(map.containsKey(ListDataTypes.ExpandPrimary) || map.containsKey(ListDataTypes.ExpandSecondary)) {
            holder.findViewById<TextView>(R.id.core_list_item_expand_content_primary).text =
                map[ListDataTypes.ExpandPrimary]
            holder.findViewById<TextView>(R.id.core_list_item_expand_content_secondary).text =
                map[ListDataTypes.ExpandSecondary]

            holder.findViewById<ImageView>(R.id.core_list_item_expand).setOnClickListener {
                holder.toggle()
            }

            holder.findViewById<ImageView>(R.id.core_list_item_expand).setOnLongClickListener(OnLongClickListener { view ->
                createDialog(view, item, position)
                true
            })
        } else {
            holder.findViewById<ImageView>(R.id.core_list_item_expand).visibility = View.GONE
        }

        holder.bind(item)
    }
    
    private fun createDialog(view: View, item: TModel, position: Int) {
        val dialog = ListMenuBottomSheetDialog.create(view.context, item)
        dialog.setOnCancelListener {
            dataSet.drop(position)
            notifyDataSetChanged()
        }
        dialog.show()
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