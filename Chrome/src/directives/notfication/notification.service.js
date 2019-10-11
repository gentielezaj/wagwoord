wwapp.factory('$notification', function ($rootScope) {
    let vm = this;

    vm.success = function(message) {
        $rootScope.$broadcast('add-nofification', {
            type: 'success',
            message: message
        }); 
    };

    vm.info = function(message) {
        $rootScope.$broadcast('add-nofification', {
            type: 'info',
            message: message
        }); 
    };

    vm.error = function(message, error) {
        $rootScope.$broadcast('add-nofification', {
            type: 'error',
            message: message
        }); 

        if(error) {
            console.error(error);
        }
    };

    vm.log = (message) => console.log(message);

    return vm;
});