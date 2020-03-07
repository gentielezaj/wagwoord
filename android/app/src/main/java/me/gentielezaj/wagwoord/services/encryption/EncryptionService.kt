package me.gentielezaj.wagwoord.services.encryption

import android.content.Context
import android.util.Base64
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import org.apache.commons.codec.binary.Hex
import java.math.BigInteger
import java.security.MessageDigest

class EncryptionService(val context: Context) {

    var encryptionKey: String?
        get() = LocalStorage.get(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY)
        set(value) {
            if(value.isNullOrEmpty()) LocalStorage.set(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY, value)
            else LocalStorage.remove(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY)
        }

    fun getEncryptionHash(e: String?) : String? {
        var encryptionKey = e?: this.encryptionKey;
        if(encryptionKey.isNullOrEmpty()) return null;

        val md = MessageDigest.getInstance("MD5").digest(encryptionKey.toByteArray())
        return Hex.encodeHexString(md)
    }

    fun getEncryptionHashAndSave(e: String?) : String? {
        if(e.isNullOrEmpty()) return null;
        encryptionKey = e;
        return getEncryptionHash(e);
    }
}