import './content-script.scss';
import PasswordHandler from './handles/passwords/password-handler';

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
    greeting: "hello"
}, function (response) {
    const model = {
        passwords: response && response.passwords ? response.passwords : [],
        settings: response && response.settings ? response.settings : [],
        blacklist: response ? response.blacklist : false
    };
    let elBody = document.getElementsByTagName('body')[0];

    sessionStorage.setItem('wwapp', JSON.stringify(model));
    elBody.appendChild(createStyleTag('content-scripts/content-script.css'));

    if(model.passwords && model.settings && model.settings.password) {
        new PasswordHandler(model.passwords, model.settings.password, model.blacklist);
    }
});