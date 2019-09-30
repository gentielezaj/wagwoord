wwapp.factory('$settings', function ($rootScope, $database) {
    let vm = this;
    const settingsKey = 'settings';
    const chromeStroage = 'local';
    const defaults = {
        password: {
            passwordLength: 20,
            passwordSymbolCharacters: '!@#$%^&*()_+~`|}{[:;?><\\,./=-'
        }
    };

    function defaultSettings() {
        return {
            server: undefined,
            password: {
                autoSubmit: false,
                passwordLength: undefined,
                sync: false,
                passwordSymbolCharacters: undefined,
                passworIncludeSymbolCharacters: true,
                syncPasswordByDefault: true
            }
        };
    }

    vm.save = function (model, property) {
        if (!model) {
            return false;
        }
        delete model.$$hashKey;
        try {
            if (property) {
                mod = vm.getObject();
                mod[property] = angular.merge(mod[property] || {}, model);
                model = mod;
            }

            localStorage.setItem(settingsKey, JSON.stringify(angular.merge(defaultSettings(), model)));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    vm.get = function (key) {
        if (key) return vm.getKey(key);
        else return vm.getObject();
    };

    vm.getObject = function () {
        let settings = localStorage.getItem(settingsKey);
        if (settings && settings.startsWith('{')) {
            return angular.merge(defaultSettings(), JSON.parse(settings));
        } else {
            return defaultSettings();
        }
    };

    vm.getKey = function (key) {
        let value = angular.merge(defaultSettings(), vm.getObject());
        let def = angular.copy(defaults);
        if (key) {
            const keys = key.split('.');
            for (let i = 0; i < keys.length && (value || def); i++) {
                if(def !== undefined) def = def[keys[i]];
                value = value[keys[i]] || def;
            }
        }

        return value;
    };

    vm.reset = function (property) {
        try {
            let model = vm.get();
            if(!property || !model.hasOwnProperty(property))
                localStorage.removeItem(settingsKey);
            else {
                vm.save(defaultSettings()[property], property);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return vm;
});