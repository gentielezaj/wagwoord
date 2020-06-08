package me.gentielezaj.wagwoord.viewModels
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity

abstract class CoreViewModel<T: IEntity>() : ViewModel(), IViewModel<T> {
    override var data: MutableLiveData<MutableList<T>> = MutableLiveData<MutableList<T>>()

    override fun addData(list: List<T>) {
        if(data.value == null) setData(list)
        else data.value!!.addAll(list)
    }

    override fun setData(list: List<T>) {
        data.value = list.toMutableList();
    }

}
