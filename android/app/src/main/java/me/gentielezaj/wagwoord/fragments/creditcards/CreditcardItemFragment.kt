package me.gentielezaj.wagwoord.fragments.creditcards

import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.databinding.CreditcardItemFragmentBinding
import me.gentielezaj.wagwoord.fragments.core.CoreItemFragment
import me.gentielezaj.wagwoord.models.entities.CreditCard

class CreditcardItemFragment(itemId: Int) : CoreItemFragment<CreditCard, CreditcardItemFragmentBinding>(R.layout.fragment_creditcard_item, itemId, CreditCard::class) {
    override fun bind() {
        binding.data = model
    }
}