package me.gentielezaj.wagwoord.fragments.passwords

import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.databinding.PasswordItemFragmentBinding
import me.gentielezaj.wagwoord.fragments.core.CoreItemFragment
import me.gentielezaj.wagwoord.models.entities.Password

class PasswordItemFragment(itemId: Int) : CoreItemFragment<Password, PasswordItemFragmentBinding>(R.layout.fragment_password_item, itemId, Password::class) {
    override fun bind() {
        binding.data = model
    }
}