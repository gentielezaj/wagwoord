wwapp.controller("BlacklistFormController", function ($scope, $notification, $blacklist) {
    var vm = this;
    vm.title = "Blacklist";
    vm.item = {
        password: true,
        address: true,
        codeGenerator: true,
        creditCard: true
    };

    vm.save = async function (form) {
        alert('TODO:check save');
        if (form.$invalid) {
            $notification.error('invalide form');
            return;
        }
        try {
            vm.item.synced = true;
            const result = await $blacklist.save(vm.item);
            if (result) $notification.success('item saved');
            else $notification.error('Error while saveing');

            return result;
        } catch (error) {
            $notification.error('Error while saveing', error);
        }
    };

    vm.resetForm = function (form) {
        vm.item = {
            password: true,
            address: true,
            codeGenerator: true,
            creditCard: true
        };
        
        form.$setUntouched();
        digest();
    };

    function digest() {
        if (!$scope.$$phase) $scope.$digest();
    }
});