package me.gentielezaj.wagwoord.ui

import android.R.attr.subtitle
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.ListView
import android.widget.TextView
import com.google.android.material.bottomsheet.BottomSheetDialog
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties


class ListMenuBottomSheetDialog {

    companion object {
        fun <TModel : IEntity> create(context: Context, item:TModel) : BottomSheetDialog {
            var properties = item.javaClass.kotlin.memberProperties.filter { it.findAnnotation<ListData>()?.showOnCopyList == true }
                .map { ItemData(R.drawable.ic_copy, it.name, DataActionType.Copy, it.get(item)) }.toMutableSet()

            properties.addAll(setOf(ItemData(R.drawable.ic_eye, "View", DataActionType.View, item.id),
                ItemData(R.drawable.ic_eye, context.getString(R.string.view), DataActionType.View, item.id),
                ItemData(R.drawable.ic_edit, context.getString(R.string.edit), DataActionType.Edit, item.id),
                ItemData(R.drawable.ic_delete, context.getString(R.string.delete), DataActionType.Delete, item.id),
                ItemData(R.drawable.ic_remove, context.getString(R.string.close), DataActionType.None, item.id)
                ))

            var dialog = BottomSheetDialog(context)
            dialog.setContentView(R.layout.dialog_layout_list_options)

            var adapter = ListMenuAdapter(dialog.context, R.layout.dialog_layout_list_item_options, properties.toTypedArray())
            var listView = dialog.findViewById<ListView>(R.id.dialog_layout_list_options_list)

            listView!!.adapter = adapter

            return dialog
        }
    }

    private class ListMenuAdapter(context: Context, itemView: Int, val data: Array<ItemData>) : ArrayAdapter<ItemData>(context, itemView, data) {

        override fun getView(position: Int, view: View?, parent: ViewGroup): View {
            val inflater: LayoutInflater = LayoutInflater.from(parent!!.context)
            val rowView: View = inflater.inflate(R.layout.dialog_layout_list_item_options, parent, false)

            val item = data[position];

            var imageView = rowView.findViewById<ImageView>(R.id.dialog_layout_list_item_options_icon)
            imageView.setImageResource(item.icon)

            var textView = rowView.findViewById<TextView>(R.id.dialog_layout_list_item_options_text)
            textView.text = item.text

            return rowView
        }
    }

    private enum class DataActionType {
        Copy,
        Edit,
        View,
        Delete,
        None
    }

    private data class ItemData(val icon: Int, val text: String, val action: DataActionType, val value: Any?)
}