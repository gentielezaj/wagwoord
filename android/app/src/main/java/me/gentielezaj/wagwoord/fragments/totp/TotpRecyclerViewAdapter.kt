package me.gentielezaj.wagwoord.fragments.totp

import android.annotation.SuppressLint
import android.os.CountDownTimer
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.util.BaseRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.IIdEntity


class TotpRecyclerViewAdapter (dataSet: List<Totp>) : BaseRecyclerViewAdapter<Totp, TotpViewHolder>(dataSet) {
    override fun newViewHolder(listItem: View): TotpViewHolder {
        return  TotpViewHolder(listItem)
    }
}

class TotpViewHolder(itemView: View) : MyViewHolder<Totp>(itemView) {
    override fun bind(item: Totp) {
        super.bind(item)
        LooperThread(item, itemView.findViewById<TextView>(R.id.core_list_item_expand_content_secondary), itemView.findViewById<TextView>(R.id.core_list_item_expand_content_primary)).start()
    }

    internal class LooperThread(val item: Totp, val timeView: TextView, val codeView: TextView) : Thread() {
        var mHandler: Handler? = null
        override fun run() {
            Looper.prepare()
            mHandler = object : Handler() {
                override fun handleMessage(msg: Message?) {
                    timeView.text = "${item.timeLeft} s"
                    codeView.text = item.code
                }
            }
            Looper.loop()
        }
    }
}