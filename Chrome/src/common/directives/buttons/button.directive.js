wwapp.directive('wwButton', function ($password) {
    return {
        restrict: 'EA',
        templateUrl: '../src/common/directives/buttons/button.directive.html',
        scope: {
            pre: "@?",
            text: "@?",
            post: "@?",
            loader: "=?",
        },
        link: function (scope, element, attribures) {
            if (scope.pre && !scope.pre.startsWith('icon-')) {
                scope.pre = 'icon-' + scope.pre;
            }
            if (scope.post && !scope.post.startsWith('icon-')) {
                scope.post = 'icon-' + scope.post;
            }
            scope.prefix = scope.pre;
            scope.suffix = scope.post;
            element[0].classList.add('icon');
            if (element[0].getAttribute('loader')) {
                element[0].classList.add('loader');
            }

            $password.updateView(scope);
        }
    };
});