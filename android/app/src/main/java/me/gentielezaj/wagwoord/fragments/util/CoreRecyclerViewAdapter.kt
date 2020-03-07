package me.gentielezaj.wagwoord.fragments.util

import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.models.ICoreModel

public class RecyclerViewAdapter<ICoreModel>(private val dataSet: Array<ICoreModel>, private val listItemFragmentId: Int) :
    RecyclerView.Adapter<RecyclerViewAdapter.MyViewHolder>() {

    class MyViewHolder(val itemView: View) : RecyclerView.ViewHolder(itemView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        var 
    }

    override fun getItemCount(): Int {
        return  dataSet.size
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
    }

}