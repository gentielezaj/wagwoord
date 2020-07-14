package me.gentielezaj.wagwoord.ui

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import android.widget.AdapterView.OnItemClickListener
import com.google.android.material.bottomsheet.BottomSheetDialog
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.AppUtil
import me.gentielezaj.wagwoord.common.Notificaiton
import me.gentielezaj.wagwoord.models.annotations.Encrypt
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity
import me.gentielezaj.wagwoord.services.encryption.EncryptionService
import me.gentielezaj.wagwoord.services.injectEntityService
import kotlin.reflect.KProperty1
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties


class ListMenuBottomSheetDialog {

    companion object {
        fun <TEntity : IEntity> create(context: Context, item: TEntity): BottomSheetDialog {
            val copyString = context.getString(R.string.copy)
            val properties =
                item.javaClass.kotlin.memberProperties.filter { it.findAnnotation<ListData>()?.showOnCopyList == true }
            val encryptionService = EncryptionService(context)
            val itemDatas = mutableListOf<ItemData>()
            for (property in properties.filter { it.get(item) != null }) {
                itemDatas.add(ItemData(R.drawable.ic_copy_24,"$copyString ${property.name}", DataActionType.Copy, property))
            }

            itemDatas.addAll(
                setOf(
                    ItemData(R.drawable.ic_eye, "View", DataActionType.View, item.id),
                    ItemData(
                        R.drawable.ic_eye,
                        context.getString(R.string.view),
                        DataActionType.View,
                        item.id
                    ),
                    ItemData(
                        R.drawable.ic_edit,
                        context.getString(R.string.edit),
                        DataActionType.Edit,
                        item.id
                    ),
                    ItemData(
                        R.drawable.ic_delete,
                        context.getString(R.string.delete),
                        DataActionType.Delete,
                        item.id
                    ),
                    ItemData(
                        R.drawable.ic_remove_24,
                        context.getString(R.string.close),
                        DataActionType.None,
                        item.id
                    )
                )
            )

            val dialog = BottomSheetDialog(context)
            dialog.setContentView(R.layout.dialog_layout_list_options)

            val adapter = ListMenuAdapter(
                dialog.context,
                R.layout.dialog_layout_list_item_options,
                itemDatas.toTypedArray()
            )
            val listView = dialog.findViewById<ListView>(R.id.dialog_layout_list_options_list)

            listView!!.adapter = adapter

            listView.onItemClickListener =
                OnItemClickListener { _, view, position, _ ->
                    val itemData = itemDatas[position]

                    val service by context.injectEntityService(item.javaClass.kotlin)

                    when (itemData.action) {
                        DataActionType.Copy -> {
                            val property = itemData.value as KProperty1<TEntity, Any>
                            var value = property.get(item).toString()
                            if(property.findAnnotation<Encrypt>() != null && item.encrypted) value = encryptionService.decrypt(value)
                            AppUtil.copyToClipBoard(
                                view.context,
                                value
                            )
                        }
                        DataActionType.View -> TODO("Create View")
                        DataActionType.Delete -> AppUtil.launch {
                            service.delete(item)
                            Notificaiton.notify(context, R.string.deleted)
                        }
                        DataActionType.Edit -> TODO("Create Edit")
                        else -> {
                            dialog.cancel()
                            return@OnItemClickListener
                        }
                    }

                    dialog.cancel()
                }

            return dialog
        }
    }

    private class ListMenuAdapter(context: Context, itemView: Int, val data: Array<ItemData>) :
        ArrayAdapter<ItemData>(context, itemView, data) {

        @SuppressLint("ViewHolder")
        override fun getView(position: Int, view: View?, parent: ViewGroup): View {
            val inflater: LayoutInflater = LayoutInflater.from(parent.context)
            val rowView: View =
                inflater.inflate(R.layout.dialog_layout_list_item_options, parent, false)
            val item = data[position]

            val imageView =
                rowView.findViewById<ImageView>(R.id.dialog_layout_list_item_options_icon)
            imageView.setImageResource(item.icon)

            val textView = rowView.findViewById<TextView>(R.id.dialog_layout_list_item_options_text)
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

    private data class ItemData(
        val icon: Int,
        val text: String,
        val action: DataActionType,
        val value: Any
    )
}