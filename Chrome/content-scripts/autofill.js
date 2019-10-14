function createScriptTag(path) {
    let script = document.createElement('script');
    script.setAttribute('src', chrome.extension.getURL(path));
    script.setAttribute('type', 'module');
    return script;
}

function createStyleTag(path) {
    //<link rel="alternate" hreflang="x-default" href="https://www.facebook.com/"></link>
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

    elBody.appendChild(createScriptTag('content-scripts/app/passwords/auto-fill-passwords.js'));
    elBody.appendChild(createScriptTag('content-scripts/app/app.js'));
    elBody.appendChild(createStyleTag('assests/css/app-defaults.css'));
    elBody.appendChild(createStyleTag('content-scripts/css/password-list-autofill.css'));
});