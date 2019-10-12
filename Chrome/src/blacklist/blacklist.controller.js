wwapp.controller("BlacklistController", function ($scope, $location) {
    var vm = this;
    vm.title = "Blacklist";

    vm.goToSettings = function () {
        $location.path('settings');
    };
});