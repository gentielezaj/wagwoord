wwapp.controller("SettingsPasswordController", function ($scope, $password, $notification) {
    let vm = this;

    vm.model = $password.settings();
    vm.saveDisable = false;

    vm.openFileImport = function () {
        document.getElementById('settingsFileImport').click();
    };

    vm.fieldSettings = {
        passwordSymbolsField: {
            pattern: `[${$password.settings('passwordSymbolCharacters')}]+`,
            placeHolder: $password.settings('passwordSymbolCharacters')
        },
        passwordLength: {
            placeholder: $password.settings('passwordLength')
        }
    };

    vm.savePasswords = async function () {
        vm.saveDisable = true;
        let progress = document.getElementById('password-upload-progress');
        if (vm.model.file.type == "application/json") {
            for (let index = 0; index < vm.model.file.data.length; index++) {
                const item = vm.model.file.data[index];
                await $password.savePassword({
                    domain: $password.getDomain(item.domain),
                    name: $password.getName(item.domain) || item.name,
                    username: item.username,
                    password: item.password
                });
                progress.value = index + 1;
            }
        } else {
            const properties = vm.model.file.data[0].replace('\r', '').split(',');
            let getProperty = function (item, property) {
                let i = properties.indexOf(property);
                return item[i];
            };
            for (let index = 1; index < vm.model.file.data.length; index++) {
                const item = vm.model.file.data[index].replace('\r', '').split(',');
                await $password.savePassword({
                    domain: $password.getDomain(getProperty(item, 'url')),
                    name: $password.getName(getProperty(item, 'url')) || getProperty(item, 'name'),
                    username: getProperty(item, 'username'),
                    password: getProperty(item, 'password')
                });
                progress.value = index + 1;
            }
        }

        $notification.success("passwords saved successfuly");
    };

    vm.saveSettings = function (input, setNull) {
        try {
            vm[`saving${input}`] = true;
            for (let property in vm.fieldSettings) {
                if (vm.fieldSettings.hasOwnProperty(property)) {
                    if (!vm.fieldSettings[property].valid) {
                        $notification.error('Input is invalid');
                        vm[`saving${input}`] = false;
                        return;
                    }
                }
            }

            if (setNull && !vm.model[input]) {
                vm.model[setNull] = undefined;
            }

            if ($password.saveSettings(vm.model)) $notification.success('Setting saved');
            else $notification.error('Error while saving');
        } catch (error) {
            vm[`saving${input}`] = false;
            $notification.error('Error while saving', error);
        }
    };

    $scope.$on('refreshSettings', () => {
        vm.model = $password.settings();
    });

    vm.downloadPasswords = async function () {
        vm.downloadPasswordsLoader = true;
        try {
            await $password.exportPassword();
            vm.downloadPasswordsLoader = false;
            $scope.$digest();
        } catch (error) {
            vm[`saving${input}`] = false;
            $notification.error('Error while exporting passwords', error);
        }
    };

    vm.deletePasswords = async function (confitmation) {
        let dialog = document.getElementById('confirmationDialog');
        if (confitmation === undefined) {
            dialog.showModal();
            return;
        }
        dialog.close();
        if (confitmation === true) {
            if (await $password.deleteAll()) {
                $notification.success('Passwords deleted');
            } else {
                $notification.error('Error while deleting passwords');
            }
        }
    };

    //#region drag-drop

    function setUpDragnDrop() {
        let container = document.getElementById('import-passwords-container');
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                console.log('ddddd');
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, () => container.classList.add('hover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, () => container.classList.remove('hover'), false);
        });

        container.addEventListener('drop', (e) => {
            let files = e.dataTransfer.files;
            let fileInput = document.getElementById('settingsFileImport');
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }, false);
    }

    setUpDragnDrop();

    //#endregion drag-drop

    $scope.$on("$destroy", function () {
        vm.model.file = null;
    });
});