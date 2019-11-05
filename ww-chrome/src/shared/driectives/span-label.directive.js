import Vue from 'vue';

var spanlabel = {
    name: 'span-label',
    inserted: function (el, attr, vnode) {
        let forId = el.getAttribute('for');
        if (!forId) return;
        let input = document.getElementById(forId);
        if (!input) return;
        el.addEventListener('click', event => {
            input.click();
        });
    }
};

Vue.directive('span-label', spanlabel);