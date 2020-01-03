import Vue from 'vue';
import {
    dataMixin,
    chromeConst
} from './init/ww-data-model.mixin';
import constants from '../shared/util/ww-constants';
import App from './views/App';
import {
    createStyleTag
} from './init/alter-dom';

// eslint-disable-next-line no-unused-vars
var app;

createStyleTag('content-scripts/content-script.css');
// createStyleTag('../assets/fontello/css/animation.css');
createStyleTag('../assets/fontello/css/fontello.css');

let meta = document.createElement('meta');
meta.setAttribute('http-equiv', 'content_security_policy');
meta.setAttribute('unsafe-inline', "sha256-SvLgADqEePEV9RNxBrRQXSBJafFHcVNG7cPzHz6h9eA=");
document.head.appendChild(meta);

let wwElement = document.createElement('div');
wwElement.id = 'wagwoord-app';
document.body.append(wwElement);

chrome.runtime.sendMessage({
    requestType: "get",
    submitted: sessionStorage.getItem('submitted')
}, function (response) {
    if(response.blacklist && response.blacklist.password && response.blacklist.address && response.blacklist.creditCard && response.blacklist.codeGenerator) {
        return;
    }

    if(response.blacklist) {
        response.blacklist.totalBlack = false;
    }
    const model = {
        passwords: response && response.passwords ? response.passwords : [],
        settings: response && response.settings ? response.settings : [],
        blacklist: response ? response.blacklist : false,
        submittedResponse: response ? response.submittedResponse : undefined
    };

    Vue.use(dataMixin, {
        ...model
    });

    Vue.use(chromeConst);
    Vue.use(constants);

    app = new Vue({
        el: '#wagwoord-app',
        dataMixin,
        constants,
        chromeConst,
        render: h => h(App)
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.requestType == 'insert-value') {
        insetValue(request.data);
    } else if (request.requestType == 'otop-value') {
        document.getElementById('wagwoord-content-script-container').dispatchEvent(new CustomEvent("messageListener", {
            bubbles: true,
            detail: request.data
        }));
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