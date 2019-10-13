wwapp.controller("BlacklistController", function ($scope, $location, $notification) {
    var vm = this;
    vm.title = "Blacklist";
    vm.dialogId = 'blacklist-form-dialog';

    vm.listOptions = {
        columns: [{
                property: 'name',
                class: 'title'
            },
            {
                property: 'checkboxes',
                template: '../src/blacklist/views/blacklist-list-item.html'
            }
        ],
        save: vm.save
    };

    vm.goToSettings = function () {
        $location.path('settings');
    };

    vm.save = function (item) {
        const dialog = document.getElementById(vm.dialogId);
        dialog.open = true;
    };
});