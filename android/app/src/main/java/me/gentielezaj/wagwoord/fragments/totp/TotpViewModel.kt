package me.gentielezaj.wagwoord.fragments.totp

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import me.gentielezaj.wagwoord.models.entities.Totp

class TotpViewModel : ViewModel() {
    fun getData() : LiveData<List<Totp>> = MutableLiveData<List<Totp>>(dataSet())

    private fun dataSet() : MutableList<Totp> {
        var dataSet = mutableListOf<Totp>()
        for(i in 1..40) {
            dataSet.add(Totp().apply {
                username = "userName$i"
                issuer = "issuer$i"
            })
        }

        return dataSet
    }
}