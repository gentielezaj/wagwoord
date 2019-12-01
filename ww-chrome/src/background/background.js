'use strict';
import BackgroundService from '../shared/services/blackground.service';

var $backgound = new BackgroundService();

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    window.open('popup/popup.html', 'extension_popup');
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.requestType == 'get') {
            const submitted = storage(sender.tab, 'submitted');
            $backgound.getDataFroDomain(sender.url, submitted).then((p) => {
                sendResponse(p);
            });

            return true;
        }

        if (request.requestType == 'formSubmited') {
            $backgound.getSubmittedResponse(request.model).then(r => {
                if(r.hasAction) storage(sender.tab, 'submitted', r);
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
    }else if (data) {
        if (typeof data != 'string') data = JSON.stringify(data);
        sessionStorage.setItem(storageKey, data);
        return true;
    } else {
        return sessionStorage.getItem(storageKey);
    }
}

async function sync() {
    await $backgound.sync();
    setTimeout(() => sync(), 60000);
}

sync().then();