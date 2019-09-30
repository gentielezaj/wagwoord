wwapp.directive("ngFileSelect", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, args, ngModel) {

            el.bind("change", function (e) {
                let element = e.srcElement || e.target;
                if (!element.files.length) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(undefined);
                    });
                }

                let reader = new FileReader();
                reader.onload = function () {
                    let data = element.files[0].type == "application/json" ? JSON.parse(reader.result) : reader.result;
                    value = element.files[0];
                    value.data = element.files[0].type == "application/json" ? data.data : data.split('\n');
                    if (element.files[0].type == "application/json") {
                        value.data = value.data.filter(d => d.name);
                    } else {
                        value.data = value.data.filter(d => /(.)+,(.)+,(.)+,(.)+/.test(d));
                    }

                    scope.$apply(function () {
                        ngModel.$setViewValue(value);
                    });
                };
                reader.readAsText(element.files[0]);
            });


            scope.$on("$destroy", function () {
                el.value = null;
            });

        }

    };


});