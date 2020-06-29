package me.gentielezaj.wagwoord.fragments.creditcards

import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.fragments.util.CoreRecyclerViewAdapter
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.annotations.getListDataText
import me.gentielezaj.wagwoord.models.entities.CreditCard

class CreditCardRecyclerViewAdapter(dataSet: List<CreditCard>) : CoreRecyclerViewAdapter<CreditCard>(dataSet,  R.layout.fragment_core_list_item) {

    override fun mapBindView (item: CreditCard) : Map<ListDataTypes, String> {
        var map = getListDataText(item).toMutableMap()
        map[ListDataTypes.Description] = "${item.cardType} **** ${item.cardNumber.substring(item.cardNumber.length - 4)}"

        return map
    }
}