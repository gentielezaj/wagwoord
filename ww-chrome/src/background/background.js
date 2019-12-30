'use strict';
import BackgroundService from '../shared/services/blackground.service';
import {
    BrowserQRCodeReader
} from '@zxing/library';

var $backgound = new BackgroundService();

// #region conext menu
// #region genertate password
chrome.contextMenus.create({
    id: 'wagwoord-contextmenu-generate-password',
    title: 'Generate password',
    contexts: ["editable"],
    visible: true,
    onclick: function (info, tab) {
        console.log(info);
        console.log(tab);
        // TODO: check settings of input
        $backgound.$password.generate().then(r => sendMessageToConentScript(tab, 'insert-value', r));
    }
});
// #endregion genertate password

chrome.contextMenus.create({
    id: 'wagwoord-contextmenu-get-barcode',
    title: 'Add barcode',
    contexts: ["image"],
    visible: true,
    onclick: function (info, tab) {
        console.log(info);
        console.log(tab);
        const codeReader = new BrowserQRCodeReader();
        codeReader.decodeFromImage(undefined, info.srcUrl).then(r => {
            $backgound.$codeGenerator.saveOrUpdate(r.text).then(id => {
                    if (id)
                        $backgound.$codeGenerator.getItemWithCode(id).then(code => {
                            sendMessageToConentScript(tab, 'otop-value', code);
                        });
                    else
                        sendMessageToConentScript(tab, 'otop-value', 'error');
                })
                .else(e => sendMessageToConentScript(tab, 'otop-value', "error"));
        });
    }
});

function sendMessageToConentScript(tab, requestType, data) {
    chrome.tabs.sendMessage(tab.id, {
        requestType,
        data
    });
}
// #endregion conext menu

// #region content script

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.requestType == 'get') {
            const submitted = storage(sender.tab, 'submitted');
            $backgound.getDataFroDomain(sender.url, submitted).then((p) => {
                sendResponse(p);
            });

            return true;
        }

        if (request.requestType == 'creditcards') {
            $backgound.$creditCards.get().then((p) => {
                sendResponse(p);
            });

            return true;
        }

        if (request.requestType == 'formSubmited') {
            $backgound.getSubmittedResponse(request.model).then(r => {
                if (r.hasAction) storage(sender.tab, 'submitted', r);
                sendResponse(r);
            });
            return true;
        }

        if (request.requestType == 'storage') {
            return storage(sender.tab, request.key, request.data);
        }

        if (request.requestType == 'post') {
            storage(sender.tab, 'submitted', 'remove');
            $backgound.save(request.model)
                .then(r => {
                    return r;
                })
                .catch(e => {
                    throw e;
                });
        }

        return false;
    });

function storage(tab, key, data) {
    const storageKey = `${tab.id}-${tab.window}-${key}`;
    if (data === 'remove') {
        sessionStorage.removeItem(storageKey);
        return true;
    } else if (data) {
        if (typeof data != 'string') data = JSON.stringify(data);
        sessionStorage.setItem(storageKey, data);
        return true;
    } else {
        return sessionStorage.getItem(storageKey);
    }
}
// #endregion content script

// #region sync
async function sync() {
    await $backgound.sync();
    setTimeout(() => sync(), 60000);
}

sync().then();
// #endregion sync