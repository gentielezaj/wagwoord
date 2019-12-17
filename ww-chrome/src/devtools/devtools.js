import './devtools.scss';


chrome.devtools.panels.create("Ww log",
    "",
    "../devtools/devtools.html",
    function (panel) {
        init(panel);
    }
);

function init(panel) {
    
    chrome.devtools.inspectedWindow.eval(
        "inspect(window.muttat)",
        { useContentScriptContext: true },
        (r) => {
            document.getElementById('script-count').innerHTML = r;
        }
    );
}

document.getElementById('refresh').addEventListener('click', (e) => init());
