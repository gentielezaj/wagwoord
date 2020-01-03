import Vue from 'vue';

var formField = {
    name: 'form',
    update: function (el, attr, vnode) {
        // TODO: implement form updated
    },
    inserted(el, attr, vnode) {
        // eslint-disable-next-line no-return-assign
        el.addEventListener('submit', event => {
            el.querySelectorAll('input').forEach(e => {
                e.setAttribute('touched', 'true');
                if (!e.validity.valid) {
                    e.parentNode.classList.add('error');
                } else {
                    e.parentNode.classList.remove('error');
                }
            });
        });
    }
};

Vue.directive('form', formField);
