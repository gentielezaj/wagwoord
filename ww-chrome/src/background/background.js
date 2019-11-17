'use strict';
import BackgroundService from '../shared/services/blackground.service';

var $backgound = new BackgroundService();

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    window.open('popup/popup.html', 'extension_popup');
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.requestType == 'get') {
            $backgound.getDataFroDomain(sender.url, request.submitted).then((p) => {
                sendResponse(p);
            });

            return true;
        }
        if (request.requestType == 'post') {
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

async function sync() {
    await $backgound.sync();
    setTimeout(() => sync(), 60000);
}

sync().then();