wwapp.directive('loader', function () {
    return {
        restrict: 'E',
        template: `<svg id="login-multispin" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="lds-curve-bars" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="translate(50,50)"><circle cx="0" cy="0" r="8.333333333333334" fill="none" stroke="var(--wagwoord-color)" stroke-width="2" stroke-dasharray="26.179938779914945 26.179938779914945" transform="rotate(358.644)">
        <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s" calcMode="spline" keySplines="0.2 0 0.8 1" begin="0" repeatCount="indefinite"/>
        </circle><circle cx="0" cy="0" r="16.666666666666668" fill="none" stroke="var(--wagwoord-color)" stroke-width="2" stroke-dasharray="52.35987755982989 52.35987755982989" transform="rotate(43.4262)">
        <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s" calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.2" repeatCount="indefinite"/>
        </circle><circle cx="0" cy="0" r="25" fill="none" stroke="var(--wagwoord-color)" stroke-width="2" stroke-dasharray="78.53981633974483 78.53981633974483" transform="rotate(125.167)">
        <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s" calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.4" repeatCount="indefinite"/>
        </circle><circle cx="0" cy="0" r="33.333333333333336" fill="none" stroke="var(--wagwoord-color)" stroke-width="2" stroke-dasharray="104.71975511965978 104.71975511965978" transform="rotate(214.615)">
        <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s" calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.6" repeatCount="indefinite"/>
        </circle><circle cx="0" cy="0" r="41.666666666666664" fill="none" stroke="var(--wagwoord-color)" stroke-width="2" stroke-dasharray="130.89969389957471 130.89969389957471" transform="rotate(299.379)">
        <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s" calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.8" repeatCount="indefinite"/>
        </circle></g></svg>`,
        scope:{
            size: '@'
        },
        link: function(scope, el, attr) {
            if(scope.size) {
                document.getElementById('login-multispin').setAttribute('style', `width:${scope.size}rem;height:${scope.size}rem`);
            }
        }
    };
});