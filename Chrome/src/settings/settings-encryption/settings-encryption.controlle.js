wwapp.controller("SettingsEncryptionController", function ($scope, $notification, $encryption) {
    let vm = this;

    vm.model = {};

    async function setModel() {
        vm.model = (await $encryption.get()) || {
            encryptionKey: undefined
        };
        if(!$scope.$$phase) $scope.$digest();
    }

    $scope.$on('refreshSettings', async () => {
        await setModel();
    });

    // #region save
    vm.saveSettings = async function (input) {
        vm[`saving${input}`] = true;

        if (vm.model[input] === '') {
            vm.model[input] = undefined;
        }

        var resu = await $encryption.save(vm.model);
        if (resu) $notification.success('Encryption saved');
        else $notification.error('Error while saving Encryption');
        vm[`saving${input}`] = false;
        if(!$scope.$$phase) $scope.$digest();
    };
    // #endregion save 

    setModel().then();
});