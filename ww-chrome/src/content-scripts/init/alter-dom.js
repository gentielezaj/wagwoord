export function createScriptTag(path) {
    let script = document.createElement('script');
    script.setAttribute('src', chrome.extension.getURL(path));
    script.setAttribute('type', 'module');
    return script;
}

export function createStyleTag(path) {
    let script = document.createElement('link');
    script.setAttribute('href', chrome.extension.getURL(path));
    script.setAttribute('type', 'text/css');
    script.setAttribute('rel', 'stylesheet');
    script.setAttribute('content_security_policy', "default-src 'self' style-src 'self' 'unsafe-inline';");
    document.head.appendChild(script);
}