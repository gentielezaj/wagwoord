import appChrome from '../common/chrome-handler';

export function confirmSubmittion(submitted) {
    if (!submitted || !submitted.hasAction) return;
    if (submitted.password) {
        confirmSubmittionPassword(submitted.password);
    }
}

// #region password

function confirmSubmittionPassword(response) {
    if(!response.model || !response.action) return;
    let model = typeof response.model == 'string' ? JSON.stringify(response.model) : response.model;
    const onSubmit = event => {
        document.getElementById('wwapp-confirmation-dialog-id').open = false;
        chrome.runtime.sendMessage({
            requestType: "post",
            model: {
                password: model
            }
        });
    };

    if (response.action == 'new') {
        showDialog(`save credetials:<br><i>${model.username}<i>`, onSubmit);
    }
    if (response.action == 'update') {
        showDialog(`update password:<br><i>${model.username}<i>`, onSubmit);
    }
}
// #endregion password

// #region dialog

function showDialog(message, onSubmit) {
    const p = document.createElement('p');
    p.innerHTML = message;

    const dialog = document.createElement('dialog');
    dialog.id = 'wwapp-confirmation-dialog-id';
    dialog.open = true;
    dialog.appendChild(p);
    dialog.appendChild(createButton('save', 'success', onSubmit));
    dialog.appendChild(createButton('reject', 'error', event => {
        dialog.open = false;
        appChrome.storage.removeItem('submitted').then();
    }));

    document.getElementsByTagName('body')[0].appendChild(dialog);
}

function createButton(value, css, onClick) {
    const button = document.createElement('input');
    button.type = 'button';
    button.classList.add(css);
    button.value = value;
    button.id = 'wwapp-confirmation-dialog-button-id-' + value;
    button.addEventListener('click', onClick);
    return button;
}
// #endregion dialog