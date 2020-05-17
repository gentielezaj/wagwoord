package me.gentielezaj.wagwoord.services.encryption

import android.content.Context
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.common.empty
import org.apache.commons.codec.binary.Hex
import org.apache.commons.codec.digest.MessageDigestAlgorithms.SHA3_512
import org.apache.commons.codec.digest.DigestUtils

class EncryptionService(val context: Context) {

    var encryptionKey: String?
        get() = LocalStorage.get(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY)
        set(value) {
            if(!value.isNullOrEmpty()) LocalStorage.set(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY, value)
            else LocalStorage.remove(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY)
        }

    fun getEncryptionHash(e: String?) : String? {
        var encryptionKey = e?: this.encryptionKey;
        if(e.isNullOrEmpty()) return String.empty;
        if(encryptionKey.isNullOrEmpty()) return null;

        return DigestUtils.sha512Hex(encryptionKey)
    }

    fun getEncryptionHash() : String? {
        var encryptionKey = this.encryptionKey;
        if(encryptionKey.isNullOrEmpty()) return null;

        return getEncryptionHash(encryptionKey);
    }

    fun getEncryptionHashAndSave(e: String?) : String? {
        if(e.isNullOrEmpty()) return null;
        encryptionKey = e;
        return getEncryptionHash(e);
    }
}