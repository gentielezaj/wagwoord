wwapp.controller("BlacklistController", function ($scope, $location, $notification) {
    var vm = this;
    vm.title = "Blacklist";

    vm.blacklist = {
        data: [{
            name: 'account.google.com',
            password: true
        }, {
            name: 'name1'
        }],
        total: 2,
        loading: false
    };

    vm.goToSettings = function () {
        $location.path('settings');
    };

    vm.save = function (item) {
        console.log(item);
        $notification.success('TODO: implement save');
    };
});