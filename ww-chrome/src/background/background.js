'use strict';
import BackgroundService from '../shared/services/blackground.service';

var $backgound = new BackgroundService();

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    window.open('popup/popup.html', 'extension_popup');
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        $backgound.getDataFroDomain(sender.url).then((p) => {
            sendResponse(p);
        });

        return true;
    });

async function sync() {
    await $backgound.sync();
    setTimeout(() => sync(), 60000);
}

sync().then();