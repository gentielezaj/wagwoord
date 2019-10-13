wwapp.directive("ngFormField", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            valid: '=?',
            disabled: '=?ngDisabled'
        },
        link: function (scope, el, args, ngModel) {
            scope.valid = ngModel.$valid;

            scope.$watch(function () {
                scope.valid = ngModel.$valid;
                if(ngModel.$invalid && ngModel.$touched && ngModel.$dirty) {
                    el.parent().addClass('error');
                } else {
                    el.parent().removeClass('error');
                }
            });

            scope.$watch('disabled', function () {
                if(scope.disabled) {
                    el.parent().parent().addClass('disabled');
                } else {
                    el.parent().parent().removeClass('disabled');
                }
            });
        }
    };
});