import './content-script.scss';
import PasswordHandler from './handles/passwords/password-handler';
import {
    confirmSubmittion
} from './handles/common/submitted-response-handler';

// eslint-disable-next-line no-unused-vars
function createScriptTag(path) {
    let script = document.createElement('script');
    script.setAttribute('src', chrome.extension.getURL(path));
    script.setAttribute('type', 'module');
    return script;
}

function createStyleTag(path) {
    let script = document.createElement('link');
    script.setAttribute('href', chrome.extension.getURL(path));
    script.setAttribute('type', 'text/css');
    script.setAttribute('rel', 'stylesheet');
    return script;
}

chrome.runtime.sendMessage({
    requestType: "get",
    submitted: sessionStorage.getItem('submitted')
}, function (response) {
    const model = {
        passwords: response && response.passwords ? response.passwords : [],
        settings: response && response.settings ? response.settings : [],
        blacklist: response ? response.blacklist : false,
        submittedResponse: response ? response.submittedResponse : undefined
    };
    let elBody = document.getElementsByTagName('body')[0];

    // TODO:remove local storage
    sessionStorage.setItem('wwapp', JSON.stringify(model));
    elBody.appendChild(createStyleTag('content-scripts/content-script.css'));

    if (model.passwords && model.settings && model.settings.password) {
        new PasswordHandler(model.passwords, model.settings.password, model.blacklist);
    }

    if (model.submittedResponse) {
        confirmSubmittion(model.submittedResponse);
    }
});

// #region get messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    console.log(sender);
    switch (request.requestType) {
        case 'insert-value':
            insetValue(request.data);
            break;
    }
});

function insetValue(data) {
    if (!data) return;
    const elem = document.activeElement;
    var start = elem.selectionStart;
    var end = elem.selectionEnd;
    if (end - start > 2) {
        elem.value = elem.value.slice(0, start) + data + elem.value.substr(end);
        elem.selectionStart = start + data.length;
        elem.selectionEnd = elem.selectionStart;
    } else {
        elem.value = data;
    }
}
// #endregion get messages