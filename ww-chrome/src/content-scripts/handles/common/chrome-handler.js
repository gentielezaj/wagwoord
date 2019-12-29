// #region storage

async function getItem(key) {
    return await createStorageRequest(key);
}

async function setItem(key, data) {
    return await createStorageRequest(key, data);
}

async function removeItem(key) {
    return await createStorageRequest(key, 'remove');
}

async function createStorageRequest(key, data) {
    return await chromeRequest('storage', {
        key,
        data
    });
}
// #endregion storage

async function post(model) {
    return await chromeRequest('post', { model });
}

// #region form submittion
async function formSubmittion(formType, model, action) {
    return await chromeRequest('formSubmited', {
        formType,
        model,
        action
    });
}
// #endregion form submittion

async function get(type, data) {
    return await chromeRequest(type, {
        type,
        data
    });
}
// #region request

function chromeRequest(requestType, data) {
    if (data === undefined) data = {};
    data.requestType = requestType;
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(data, function (response) {
            resolve(response);
        });
    });
}
// #endregion request

// #region return
export default {
    storage: {
        getItem,
        setItem,
        removeItem
    },
    post,
    formSubmittion,
    get
};
// #endregion return