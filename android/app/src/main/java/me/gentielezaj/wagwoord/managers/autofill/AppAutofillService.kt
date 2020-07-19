package me.gentielezaj.wagwoord.managers.autofill

import android.os.CancellationSignal
import android.service.autofill.*

class AppAutofillService : AutofillService() {
    override fun onFillRequest(
        request: FillRequest,
        cancellationSignal: CancellationSignal,
        callback: FillCallback
    ) {
        TODO("Not yet implemented")
    }

    override fun onSaveRequest(request: SaveRequest, callback: SaveCallback) {
        TODO("Not yet implemented")
    }
}