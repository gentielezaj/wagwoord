package me.gentielezaj.wagwoord.managers.autofill

import android.app.assist.AssistStructure
import android.os.CancellationSignal
import android.service.autofill.*
import android.view.autofill.AutofillValue
import android.widget.RemoteViews
import com.google.common.net.InternetDomainName
import me.gentielezaj.wagwoord.R

enum class AutofillFieldTypes {
    USERNAME,
    PASSWORD,
    FIRSTNAME,
    LASTNAME
}

class AppAutofillService : AutofillService() {

    override fun onFillRequest(
        request: FillRequest,
        cancellationSignal: CancellationSignal,
        callback: FillCallback
    ) {
//        val contexts = request.fillContexts
//        val contex = contexts[contexts.size - 1]
//        val structure = contex.structure
//        val windowNode = structure.getWindowNodeAt(0)
//        val viewNode = windowNode.rootViewNode // pretend this is an EditText

        // val domain = getCanonicalDomain(contex.structure.activityComponent.packageName)

        val viewNode = loopContext(request.fillContexts).firstOrNull()
        if(viewNode == null) {
            callback.onFailure("fuck this shit");
            return
        }

        val suggestionText = "gogi@gmai.com"
        val suggestion = RemoteViews(packageName, R.layout.autofill_suggestion)
        suggestion.setTextViewText(R.id.autofill_suggestion_text, suggestionText)

        val suggestionDataset = Dataset.Builder()
            .setValue(viewNode.autofillId!!, AutofillValue.forText("gogi@gmail.com"), suggestion)
            .build()

        val response = FillResponse.Builder()
            .addDataset(suggestionDataset)
            .build()

        callback.onSuccess(response)
    }

    fun loopContext(contexts: List<FillContext>): List<AssistStructure.ViewNode>{
        val emailFields = mutableListOf<AssistStructure.ViewNode>()
        for (context in contexts.filter { it.structure.windowNodeCount > 0 }) {
            for (windowIndex in 0 until context.structure.windowNodeCount) {
                emailFields.addAll(identifyEmailFields(context.structure.getWindowNodeAt(windowIndex).rootViewNode))
            }
        }

        return emailFields
    }

    fun identifyEmailFields(node: AssistStructure.ViewNode): List<AssistStructure.ViewNode> {
        val emailFields = mutableListOf<AssistStructure.ViewNode>()
        if (node.className?.contains("EditText", true) == true) {
            val viewId = node.idEntry
            if (viewId != null && (viewId.contains("email") || viewId.contains("username"))) {
                emailFields.add(node)
            }
        } else if(node.childCount > 0) {
            for (index in 0 until node.childCount){
                emailFields.addAll(identifyEmailFields(node.getChildAt(index)))
            }
        }

        return emailFields
    }

    private fun getCanonicalDomain(domain: String): String? {
        var idn = InternetDomainName.from(domain);
        while (idn != null && !idn.isTopPrivateDomain()) {
            idn = idn.parent();
        }
        return idn?.toString()
    }

    override fun onSaveRequest(request: SaveRequest, callback: SaveCallback) {
        TODO("Not yet implemented")
    }
}