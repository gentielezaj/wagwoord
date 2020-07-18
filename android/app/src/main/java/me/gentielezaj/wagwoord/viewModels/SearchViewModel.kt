package me.gentielezaj.wagwoord.viewModels

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import me.gentielezaj.wagwoord.common.empty

class SearchViewModel : ViewModel() {
    var searchText: MutableLiveData<String> = MutableLiveData<String>()

    fun setText(text: String) {
        searchText.value = text
    }

    fun getText() : String = searchText.value?:String.empty
}
