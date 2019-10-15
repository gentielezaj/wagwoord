wwapp.controller("BlacklistController", function ($scope, $location, $notification, $blacklist) {
    var vm = this;
    vm.title = "Blacklist";
    vm.dialogId = 'blacklist-form-dialog';
    vm.deleteConfirmationDialogId = 'blacklist-delete-all-dialog';

    vm.goToSettings = function () {
        $location.path('settings');
    };

    vm.add = function (item) {
        const dialog = document.getElementById(vm.dialogId);
        dialog.open = true;
    };

    vm.sync = async function () {
        vm.blacklistSyncLoader = true;
        try {
            let result = await $blacklist.update();
            if (result) {
                $notification.success('Synced');
            } else $notification.error('Error while sync blacklist');
        } catch (error) {
            $notification.error('Error while sync blacklist', error);
        }

        vm.blacklistSyncLoader = false;
        $blacklist.updateView($scope);
    };
    
    vm.deleteAll = async function (response) {
        vm.deleteAllLoader = true;
        const deleteDialog = document.getElementById(vm.deleteConfirmationDialogId);
        if (response === undefined) {
            deleteDialog.open = true;
            return;
        }

        if (response) {
            try {
                if (await $blacklist.deleteAll())
                    $notification.success('Blacklist deleted');
                else $notification.error('Error while deleting');
            } catch (error) {
                $notification.error('Error while deleting', error);
            }
        }

        vm.deleteAllLoader = false;
        $scope.$broadcast('refresh');
    };

    vm.onFormSubmit = function () {
        const dialog = document.getElementById(vm.dialogId);
        dialog.open = false;
        $scope.$broadcast('refresh');
    };

    vm.listOptions = {
        columns: [{
                property: 'name',
                class: 'title'
            },
            {
                property: 'checkboxes',
                template: '/src/blacklist/views/blacklist-list-item.html'
            }
        ],
        edit: vm.add
    };
});