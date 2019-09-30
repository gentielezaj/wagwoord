wwapp.controller("SettingsController", function ($scope, $password, $notification, $settings) {
    let vm = this;
    vm.saveDisable = false;

    vm.resetSettings = function (property) {
        const dialog = document.getElementById('confirmationDialog-resetSettings');
        dialog.setAttribute('confiramtion-for', property || '');
        dialog.showModal();
    };

    vm.confirmResetSettings = function(reset) {
        const dialog = document.getElementById('confirmationDialog-resetSettings');
        if (reset) {
            let p = dialog.getAttribute('confiramtion-for');
            $settings.reset(p || undefined);
            $notification.success('Settings reseted');
            $scope.$broadcast('refreshSettings');
        }
        dialog.close();
    };

    vm.scrollTo = function (id) {
        if (!id) {
            document.documentElement.scrollTop = 0;
        } else {
            document.documentElement.scrollTop = document.getElementById(id).offsetTop;
        }
    };
});