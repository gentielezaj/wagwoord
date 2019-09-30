wwapp.controller("SettingsSyncController", function ($scope, $password, $notification, $settings) {
    let vm = this;
    vm.saveDisable = false;
    const settingName = 'server';

    const settings = {
        get: () => $settings.get(settingName),
        reset: () => $settings.reset(settingName),
        save: (model) => $settings.save(model, settingName)
    };
    vm.fieldSettings = {
        domain: true,
        headers: true
    };
    vm.model = settings.get();

    $scope.$on('refreshSettings', () => {
        vm.model = settings.get();
    });

    // #region save
    vm.saveSettings = function (input) {
        vm[`saving${input}`] = true;

        if(!vm.fieldSettings[input]) {
            $notification.error(input + ' not valid');
            vm[`saving${input}`] = false;
            return;
        }

        if (vm.model[input] === '') {
            vm.model[input] = undefined;
        }

        if (settings.save(vm.model)) $notification.success('Setting saved');
        else $notification.error('Error while saving');
        vm[`saving${input}`] = false;
    };
    // #endregion save 
});