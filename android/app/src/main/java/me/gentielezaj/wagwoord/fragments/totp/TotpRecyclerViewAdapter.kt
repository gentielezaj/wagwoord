package me.gentielezaj.wagwoord.fragments.totp

import android.view.View
import android.widget.TextView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.util.BaseRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Totp
import java.util.*


class TotpRecyclerViewAdapter (dataSet: List<Totp>) : BaseRecyclerViewAdapter<Totp, TotpViewHolder>(dataSet) {
    override fun newViewHolder(listItem: View): TotpViewHolder {
        return  TotpViewHolder(listItem)
    }
}

class TotpViewHolder(itemView: View) : MyViewHolder<Totp>(itemView) {

    var countDown : Timer = Timer()

    override fun bind(item: Totp) {
        super.bind(item)

        val primary = itemView.findViewById<TextView>(R.id.core_list_item_expand_content_primary);
        val secondary = itemView.findViewById<TextView>(R.id.core_list_item_expand_content_secondary)
        startCountDown(item, primary, secondary)
    }

    fun startCountDown(item: Totp, code: TextView, time: TextView) {
        countDown.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                code.text = item.code
                time.text = "${item.timeLeft} s"
            }
        }, 0, 100)
    }

    fun onDestroy() {
        countDown.cancel()
    }
}