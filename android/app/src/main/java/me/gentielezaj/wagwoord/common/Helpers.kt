package me.gentielezaj.wagwoord.common

import android.content.ClipboardManager
import android.content.Context
import android.content.Context.CLIPBOARD_SERVICE
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Build
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import me.gentielezaj.wagwoord.R
import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
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

        fun copyToClipBoard(context: Context, text: String, hideNotification: Boolean = false) {
            val clipboard: ClipboardManager? = context.getSystemService(CLIPBOARD_SERVICE) as ClipboardManager?
            val clip = android.content.ClipData.newPlainText("Copied Text", text);
            clipboard!!.setPrimaryClip(clip);

            if(!hideNotification) {
                var copiedText = context.getString(R.string.copy_to_clipboard_copied)
                Toast.makeText(context, copiedText, Toast.LENGTH_SHORT).show()
            }
        }

        fun launch(statement: suspend () -> Unit) {
            GlobalScope.launch(Dispatchers.Main) {
                statement()
            }
        }
    }
}

class Notificaiton {
    companion object {
        fun notify(context: Context, text: String) {
            Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
        }

        fun notify(context: Context, id: Int) = notify(context, context.getString(id))
    }
}