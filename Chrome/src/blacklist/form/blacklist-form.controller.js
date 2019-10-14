wwapp.component('blacklistForm', {
    templateUrl: '/src/blacklist/form/blacklist-form.controller.html',
    transclude: true,
    bindings: {
        id: '<',
        onSubmit: '&'
    },
    controllerAs: 'vm',
    controller: function ($scope, $rootScope, $notification, $blacklist) {
        var vm = this;
        vm.title = "Blacklist";
        vm.item = {
            password: true,
            address: true,
            codeGenerator: true,
            creditCard: true
        };

        vm.save = async function (form) {
            if (form.$invalid) {
                $notification.error('invalide form');
                return;
            }
            vm.savingForm = true;
            try {
                vm.item.synced = true;
                vm.item.id = await $blacklist.save(vm.item);
                if (vm.item.id) $notification.success('item saved');
                else $notification.error('Error while saveing');
            } catch (error) {
                $notification.error('Error while saveing', error);
            }

            vm.savingForm = false;
            vm.reject(form, vm.item);
        };

        vm.reject = function (form, item) {
            vm.item = {
                password: true,
                address: true,
                codeGenerator: true,
                creditCard: true
            };

            form.$setUntouched();
            vm.onSubmit(item);
            digest();
        };

        function digest() {
            if (!$scope.$$phase && !$rootScope.$$phase) $scope.$digest();
        }
    }
});


// wwapp.controller("BlacklistFormController", function ($scope, $notification, $blacklist) {

// });