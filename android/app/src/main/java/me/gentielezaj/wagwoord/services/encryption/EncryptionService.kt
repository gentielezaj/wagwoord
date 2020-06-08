package me.gentielezaj.wagwoord.services.encryption

import android.content.Context
import android.util.Base64.DEFAULT
import android.util.Base64.decode
import me.gentielezaj.wagwoord.common.Constants
import me.gentielezaj.wagwoord.common.LocalStorage
import me.gentielezaj.wagwoord.common.empty
import org.apache.commons.codec.digest.DigestUtils
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec


class EncryptionService(val context: Context) {

    private var _encryptionKey: String? = null

    var encryptionKey: String?
        get() {
            if(_encryptionKey.isNullOrEmpty()) _encryptionKey = LocalStorage.get(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY)
            return _encryptionKey
        }
        set(value) {
            if(!value.isNullOrEmpty()) {
                LocalStorage.set(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY, value)
                _encryptionKey = value
            }
            else{
                LocalStorage.remove(context!!, Constants.LocalStorageKeys.ENCRYPTION_KEY)
                encryptionKey = null
            }
        }

    // region hash
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

    //endregion hash

    // region encrypt

    fun encrypt(text: String) : String {
        if(encryptionKey == null || text.isNullOrEmpty()) return text;
        return AESHelper.encrypt(encryptionKey!!, text)
    }

    fun decrypt(text: String) : String {
        if(encryptionKey == null || text.isNullOrEmpty()) return text;

        return AESHelper.decrypt(encryptionKey!!, text)
    }

    private class EncryptedData {
        lateinit var salt: ByteArray
        lateinit var iv: ByteArray
        lateinit var encryptedData: ByteArray
    }
    // endregion encrypt
}