wwapp.directive('notifications', function () {
    return {
        restrict: 'EA',
        templateUrl: '../src/directives/notfication/notifications.directive.html',
        link: function(scope) {
            scope.notifications = [];

            scope.$on('add-nofification', function(event, notification) {
                notification.id = new Date().getTime();
                scope.notifications.unshift(notification);
                digest();
                setTimeout(() => {
                    scope.close(notification);
                    digest();
                }, 5000);
            });

            scope.close = function (notification, itemIndex) {
                const index = scope.notifications.indexOf(notification);
                scope.notifications.splice(index, 1);
            };

            function digest() {
                if(!scope.$$phase) scope.$digest();
            }
        }
    };
});