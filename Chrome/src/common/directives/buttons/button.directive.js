wwapp.directive('wwButton', function () {
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
            scope.prefix = scope.text && scope.pre ? '&nbsp;' : '';
            scope.suffix = scope.text && scope.post ? '&nbsp;' : '';
            if (scope.pre && scope.pre.startsWith('icon-')) {
                scope.pre = 'icon-' + scope.pre;
            }
            if (scope.post && scope.post.startsWith('icon-')) {
                scope.post = 'icon-' + scope.post;
            }
            element[0].classList.add('icon');
            if (element[0].getAttribute('loader')) {
                element[0].classList.add('loader');
            }
        }
    };
});