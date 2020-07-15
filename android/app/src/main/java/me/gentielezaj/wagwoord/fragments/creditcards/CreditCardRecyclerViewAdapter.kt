package me.gentielezaj.wagwoord.fragments.creditcards

import android.view.View
import android.widget.ImageView
import android.widget.TextView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.util.CoreRecyclerViewAdapter
import me.gentielezaj.wagwoord.fragments.util.MyViewHolder
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.annotations.getListDataText
import me.gentielezaj.wagwoord.models.entities.CreditCard
import me.gentielezaj.wagwoord.models.entities.CreditCardType

class CreditCardRecyclerViewAdapter(dataSet: List<CreditCard>) : CoreRecyclerViewAdapter<CreditCard>(dataSet,  R.layout.fragment_credit_card_list_item) {

    override fun mapBindView (item: CreditCard) : Map<ListDataTypes, String> {
        var map = getListDataText(item).toMutableMap()
        map[ListDataTypes.Description] = "**** **** **** ${item.cardNumber.substring(item.cardNumber.length - 4)}"

        return map
    }

    override fun onBindViewHolder(holder: MyViewHolder<CreditCard>, position: Int) {
        super.onBindViewHolder(holder, position)
        val item = dataSet[position]
        var creditCardDrawableId = creditCardIcon(item.cardType)

        if(creditCardDrawableId > -1)
            holder.findViewById<ImageView>(R.id.core_list_item_credit_card_icon).setImageResource(creditCardDrawableId)
    }

    private fun creditCardIcon(type: CreditCardType) : Int = when(type) {
        CreditCardType.VisaElectron,
        CreditCardType.Visa -> R.drawable.ic_credit_cards_visa
        CreditCardType.AmericanExpress -> R.drawable.ic_credit_cards_amex
        CreditCardType.Discover -> R.drawable.ic_credit_cards_discover
        CreditCardType.Diners -> R.drawable.ic_credit_cards_diners_club
        CreditCardType.Maestro -> R.drawable.ic_credit_cards_maestro
        CreditCardType.MasterCard -> R.drawable.ic_credit_cards_mastercard
        else -> -1
    }
}