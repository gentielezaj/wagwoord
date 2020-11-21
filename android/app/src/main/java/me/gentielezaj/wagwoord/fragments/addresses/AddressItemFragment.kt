package me.gentielezaj.wagwoord.fragments.addresses

import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.databinding.AddressItemFragmentBinding
import me.gentielezaj.wagwoord.fragments.core.CoreItemFragment
import me.gentielezaj.wagwoord.models.entities.Address

class AddressItemFragment(itemId: Int) : CoreItemFragment<Address, AddressItemFragmentBinding>(R.layout.fragment_address_item, itemId, Address::class) {
    override fun bind() {
        binding.data = model
    }
}