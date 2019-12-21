import Vue from 'vue';
import dataMixin from './init/ww-data-model.mixin';
import App from './views/App';
import {
    createStyleTag
} from './init/alter-dom';

// eslint-disable-next-line no-unused-vars
var app;

document.body.appendChild(createStyleTag('content-scripts/content-script.css'));
document.body.appendChild(createStyleTag('../assets/fontello/css/animation.css'));
document.body.appendChild(createStyleTag('../assets/fontello/css/fontello.css'));

let wwElement = document.createElement('div');
wwElement.id = 'wagwoord-app';
document.body.append(wwElement);

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

    Vue.use(dataMixin, {
        ...model
    });

    app = new Vue({
        el: '#wagwoord-app',
        dataMixin,
        render: h => h(App)
    });

    setTimeout(() => {
        document.getElementById('wagwoord-content-script-container').dispatchEvent(new CustomEvent("messageListener", {
            bubbles: true,
            detail: "meesagrgdf"
          }));
    }, 5000);
});