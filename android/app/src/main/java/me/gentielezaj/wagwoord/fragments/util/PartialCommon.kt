package me.gentielezaj.wagwoord.fragments.util

import android.view.View
import android.widget.TextView
import me.gentielezaj.wagwoord.R
import me.gentielezaj.wagwoord.common.AppUtil

fun copy(view: View, value: Any?) {
    AppUtil.copyToClipBoard(view.context, value?.toString())
}

data class PartialModel(
    val label: String,
    val value: Any?,
    var visible: Boolean = false,
    val hiddenValue: String = "******"
) {
    fun changeVisibility(view: View) {
        visible = !visible
        var parent = view.parent.parent;
        if (parent is androidx.constraintlayout.widget.ConstraintLayout) {
            parent.findViewById<TextView>(R.id.partial_layout_password_view_value).text = if(visible) (value?.toString()?:"-") else hiddenValue
        }
    }
}

fun getPasswordModel(label: String, value: String): PartialModel = PartialModel(label, value)