package me.gentielezaj.wagwoord.common

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Build
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.memberProperties

fun <T: Any> KClass<T>.property(name: String) : KProperty1<T, Any?> = this.propertyOrNull(name)!!

fun <T: Any> KClass<T>.propertyOrNull(name: String) : KProperty1<T, Any?>? {
    return this.memberProperties.find { it.name == name }
}

public val String.Companion.empty: String
    get() = ""

public class AppUtil {
    companion object {
        fun vectorToBitmap(context: Context, drawableId: Int) : Bitmap {
            var drawable: Drawable = ContextCompat.getDrawable(context, drawableId)!!
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                drawable = DrawableCompat.wrap(drawable).mutate()
            }

            val bitmap = Bitmap.createBitmap(
                drawable.intrinsicWidth,
                drawable.intrinsicHeight, Bitmap.Config.ARGB_8888
            )
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight())
            drawable.draw(canvas)

            return bitmap
        }
    }
}