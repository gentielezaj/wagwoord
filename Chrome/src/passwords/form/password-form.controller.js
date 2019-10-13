wwapp.controller("PasswordFormController", function ($scope, $password, $rootScope, $notification, $location) {
    var vm = this;
    vm.model = {
        synced: true
    };

    vm.showButtonLabel = false;

    vm.getPasswordLength = function () {
        if (!vm.model.password) return 0;
        return vm.model.password.length;
    };

    vm.showPassword = function (hidePassword) {
        let el = document.getElementById('password-form-password');
        if (el.getAttribute('type') == 'password' && !hidePassword) {
            el.setAttribute('type', 'text');
            vm.showButtonLabel = true;
        } else {
            el.setAttribute('type', 'password');
            vm.showButtonLabel = false;
        }
    };

    $scope.$on('edit-password', async function (event, password) {
        await editPassword(password);
    });

    async function editPassword(password) {
        vm.showPassword(true);
        let id = parseInt(password);
        if (id || password.id) {
            vm.model = await $password.getItem(id || password.id);
            if(!$scope.$$phase) $scope.$digest();
        } else {
            password.domain = $password.getDomain(password.domain);
            vm.model = password;
        }
    }

    vm.generatePassword = function () {
        vm.model.password = $password.generatePassword();
    };

    vm.resetForm = function (form) {
        vm.model = {
            synced: true
        };
        vm.showPassword(true);
        form.$setUntouched();
        if(!$scope.$$phase) $scope.$digest();
    };

    vm.save = async function (form) {
        if (form.$invalid) {
            $notification.error('Invalid form');
            return;
        }

        vm.savingForm = true;
        vm.model.synced = vm.model.synced || false;
        try {
            await $password.save(vm.model);
            $notification.success('Password saved');
            $rootScope.$broadcast('refresh');
            vm.resetForm();
        } catch (error) {
            console.log(error);   
            $rootScope.$broadcast('add-nofification', {
                type: 'error',
                message: 'form invalide'
            }); 
        }
        
        vm.savingForm = false;
    };

    if($location.$$absUrl.indexOf('itemId=') > -1) {
        id = $location.$$absUrl.match('itemId=[0-9]+')[0].replace('itemId=', '');
        editPassword(id);
    }
});