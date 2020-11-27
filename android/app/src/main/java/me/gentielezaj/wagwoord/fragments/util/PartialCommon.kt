package me.gentielezaj.wagwoord.fragments.util

import android.view.View
import android.widget.TextView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.AppUtil
import me.gentielezaj.wagwoord.common.empty
import me.gentielezaj.wagwoord.fragments.util.PartialModelType.Property

enum class PartialModelType{
    Property,
    Password,
    Creditcard
}

data class PartialModel(
    val label: String,
    val value: Any?,
    var visible: Boolean = true,
    val hiddenValue: String = "******",
    var display: String? = null,
    val type: PartialModelType = Property,
) {
    init {
        display = display?:value?.toString()?:"-"
    }

    fun copy(view: View) {
        AppUtil.copyToClipBoard(view.context, value?.toString())
    }

    fun isHiddenValue() : Boolean {
        return listOf(PartialModelType.Password, PartialModelType.Creditcard).contains(type)
    }

    fun displayValue(): String =
        when(type) {
            PartialModelType.Password -> if (visible) display!! else hiddenValue
            else -> display!!
        }

    fun changeVisibility(view: View) {
        visible = !visible
        val parent = view.parent.parent
        if (parent is androidx.constraintlayout.widget.ConstraintLayout) {
            parent.findViewById<TextView>(R.id.partial_layout_password_view_value).text = if(visible) (display) else hiddenValue
        }
    }
}

fun displayProperty(label: String, value: Any?): PartialModel = PartialModel(label, value, type = Property)
fun displayPassword(label: String, value: String): PartialModel = PartialModel(label, value, visible = false, type = PartialModelType.Password)
fun displayCreditCard(label: String, value: String?): PartialModel {
    var displayValue = String.empty
    if(value?.length?:0 > 0) {
        for (i in value!!.indices) {
            if(i > 0 && i % 4 == 0) displayValue += " "
            displayValue += value[i]
        }
    }
    return PartialModel(label, value, visible = false, type = PartialModelType.Password, display = displayValue, hiddenValue = "**** **** **** " + value!!.substring((12)))
}

fun display(label: String, value: Any?, type: PartialModelType?) : PartialModel {
    return when(type?: Property) {
        PartialModelType.Password -> displayPassword(label, value?.toString()?:"-")
        PartialModelType.Creditcard -> displayCreditCard(label, value?.toString()?:"-")
        else -> displayProperty(label, value)
    }
}