export function confirmSubmittion(submitted) {
    if (!submitted) return;
    let model = sessionStorage.getItem('submitted');
    if (!model) return;
    model = JSON.parse(model);
    if (submitted.password && model.password) {
        confirmSubmittionPassword(submitted.password, model.password);
    }
}

function confirmSubmittionPassword(response, model) {
    const onSubmit = event => {
        document.getElementById('wwapp-confirmation-dialog-id').open = false;
        chrome.runtime.sendMessage({
            requestType: "post",
            model: {
                password: model
            }
        });
    };

    if (response == 'new') {
        showDialog('save credetials', onSubmit);
    }
    if (response == 'update') {
        showDialog('update password for', onSubmit);
    }
}

function showDialog(message, onSubmit) {
    const p = document.createElement('p');
    p.innerHTML = message;

    const dialog = document.createElement('dialog');
    dialog.id = 'wwapp-confirmation-dialog-id';
    dialog.open = true;
    dialog.appendChild(p);
    dialog.appendChild(createButton('save', onSubmit));
    dialog.appendChild(createButton('reject', event => {
        dialog.open = false;
        sessionStorage.removeItem('submitted');
    }));

    document.getElementsByTagName('body')[0].appendChild(dialog);
}

function createButton(value, onClick) {
    const button = document.createElement('input');
    button.type = 'button';
    button.value = value;
    button.id = 'wwapp-confirmation-dialog-button-id-' + value;
    button.addEventListener('click', onClick);
    return button;
}