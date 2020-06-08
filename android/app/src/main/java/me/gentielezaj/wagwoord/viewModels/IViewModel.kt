package me.gentielezaj.wagwoord.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.models.entities.Totp
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity

interface IViewModel<T: IEntity> {
    var data: MutableLiveData<MutableList<T>>
    fun addData(list: List<T>)
    fun setData(list: List<T>)
}