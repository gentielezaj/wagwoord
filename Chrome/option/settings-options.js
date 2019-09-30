var autoSubmit = {
    get element() {
        return document.getElementById("autoSubmitInput");
    },
    saveDbSetting(callback) {
        saveDbSetting('autoSubmit', autoSubmit.element.checked, callback);
    }
};

var jsonFile = {
    get element() {
        return document.getElementById("jsonFileInput");
    },
    readTextJson(e) {
        if(!jsonFile.element.files.length) return;
        let input = event.target;

        let reader = new FileReader();
        reader.onload = function(){
            let data = JSON.parse(reader.result);
            jsonFile.savePasswords(data.data);
        };
        reader.readAsText(input.files[0]);
    },
    savePasswords(data) {
        for (const item of data) {
            item.id = false;
            saveDbPassword(item);
        }
    }
};

autoSubmit.element.addEventListener("change", changeValue);
jsonFile.element.addEventListener("change", jsonFile.readTextJson);

var settings = {};

function changeValue(event) {
    autoSubmit.saveDbSetting(getSettings);
}

function setValues() {
    autoSubmit.element.checked = settings.autoSubmit;
}

function getSettings() {
    getDbSettings((s) => {
        settings = s;
        setValues();
    });
}

getSettings();