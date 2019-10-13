wwapp.controller("SettingsEncryptionController", function ($scope, $notification, $encryption, $password) {
    let vm = this;
    vm.dialogId = 'encyption-input-dialog';

    vm.model = {};

    async function setModel() {
        vm.model = (await $encryption.get()) || {
            encryptionKey: undefined
        };
        if (!$scope.$$phase) $scope.$digest();
    }

    $scope.$on('refreshSettings', async () => {
        await setModel();
    });

    vm.dialog = async function(open) {
        if(open) {
            await setModel();
        }

        const element = document.getElementById(vm.dialogId);
        element.open = open ? true : false;
    };

    // #region save
    vm.saveSettings = async function (input, update) {
        vm[`saving${input}`] = true;

        if (vm.model[input] === '') {
            vm.model[input] = undefined;
        }

        try {
            let oldValue = await $encryption.get();
            let resu = await $encryption.save(vm.model);
            if(resu) {
                if(oldValue[input] !== vm.model[input] && update) {
                    if (await $password.updateServer('all')) {
                        $notification.success('Encryption saved and synced');
                    } else $notification.error('Error while saving Encryption');
                } else {
                    $notification.success('Encryption saved');
                }
            } else $notification.error('Error while saving Encryption');
        } catch (error) {
            $notification.error('Error while saving Encryption', error);
        }

        vm[`saving${input}`] = false;
        await vm.dialog();
        if (!$scope.$$phase) $scope.$digest();
    };
    // #endregion save 

    setModel().then();
});