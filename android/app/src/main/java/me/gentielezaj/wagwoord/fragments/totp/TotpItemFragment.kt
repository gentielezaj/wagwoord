package me.gentielezaj.wagwoord.fragments.totp

import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.databinding.TotpItemFragmentBinding
import me.gentielezaj.wagwoord.fragments.core.CoreItemFragment
import me.gentielezaj.wagwoord.models.entities.Totp

class TotpItemFragment(itemId: Int) : CoreItemFragment<Totp, TotpItemFragmentBinding>(R.layout.fragment_totp_item, itemId, Totp::class) {
    override fun bind() {
        binding.data = model
    }
}