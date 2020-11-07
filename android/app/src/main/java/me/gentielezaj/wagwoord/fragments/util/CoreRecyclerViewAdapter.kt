package me.gentielezaj.wagwoord.fragments.util

import android.view.*
import android.widget.ImageView
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.activities.views.ItemViewActivity
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.annotations.getListDataText
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.ui.ListMenuBottomSheetDialog

abstract class BaseRecyclerViewAdapter<TModel : IEntity, TViewHolder: MyViewHolder<TModel>>(dataSet: List<TModel>, listItemFragmentId: Int = R.layout.fragment_core_list_item) :
    RecyclerView.Adapter<TViewHolder>() {

    protected var dataSet: MutableList<TModel>
    private var listItemFragmentId: Int = 0

    init {
        this.dataSet = dataSet.toMutableList()
        this.listItemFragmentId = listItemFragmentId
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        val listItem = layoutInflater.inflate(listItemFragmentId, parent, false)
        return newViewHolder(listItem)
    }

    abstract fun newViewHolder(listItem: View) : TViewHolder

    override fun getItemCount(): Int {
        return  dataSet.size
    }

    protected open fun mapBindView (item: TModel) : Map<ListDataTypes, String> = getListDataText(item)

    override fun onBindViewHolder(holder: TViewHolder, position: Int) {
        val item = dataSet[position]
        val map = mapBindView(item)
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

            holder.findViewById<ImageView>(R.id.core_list_item_expand).setOnLongClickListener { view ->
                createDialog(view, item, position)
                true
            }
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
        dataSet = data.toMutableList()
        notifyDataSetChanged()
    }

}


open class MyViewHolder<TEntity: IEntity>(itemView: View) : RecyclerView.ViewHolder(itemView) {
    private fun findViewById(id: Int) : View {
        return itemView.findViewById(id)
    }

    fun <T> findViewById(id: Int) : T {
        @Suppress("UNCHECKED_CAST")
        return  this.findViewById(id) as T
    }

    fun toggle() {
        val view = findViewById<RelativeLayout>(R.id.core_list_item_expand_content)
        view.visibility = if(view.visibility == View.GONE) View.VISIBLE else View.GONE
    }

    open fun bind(item: TEntity) {
        itemView.setOnClickListener {
            val intent = ItemViewActivity.open(itemView.context, item.id, item.javaClass.kotlin)
            itemView.context.startActivity(intent)
        }
    }
}

open class CoreRecyclerViewAdapter<TModel : IEntity>(dataSet: List<TModel>, listItemFragmentId: Int = R.layout.fragment_core_list_item) : BaseRecyclerViewAdapter<TModel, MyViewHolder<TModel>>(dataSet, listItemFragmentId) {
    override fun newViewHolder(listItem: View): MyViewHolder<TModel> = MyViewHolder(listItem)
}