package me.gentielezaj.wagwoord.fragments.totp

import android.os.CountDownTimer
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.view.View
import android.widget.TextView
import androidx.core.view.doOnDetach
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.util.BaseRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.entities.Totp


class TotpRecyclerViewAdapter (dataSet: List<Totp>) : BaseRecyclerViewAdapter<Totp, TotpViewHolder>(dataSet) {
    override fun newViewHolder(listItem: View): TotpViewHolder {
        return  TotpViewHolder(listItem)
    }
}

class TotpViewHolder(itemView: View) : MyViewHolder<Totp>(itemView) {

    var countDown : CountDownTimer? = null

    override fun bind(item: Totp) {
        super.bind(item)

        val primary = itemView.findViewById<TextView>(R.id.core_list_item_expand_content_primary);
        val secondary = itemView.findViewById<TextView>(R.id.core_list_item_expand_content_secondary)
        startCountDown(item, primary, secondary)
    }

    fun startCountDown(item: Totp, code: TextView, time: TextView) {
        countDown = object : CountDownTimer((item.timeLeft * 1000).toLong(), 100) {
            override fun onTick(millisUntilFinished: Long) {
                code.text = item.code
                time.text = "${item.timeLeft} s"
            }

            override fun onFinish() {
                startCountDown(item, code, time)
            }
        }.start()
    }
}