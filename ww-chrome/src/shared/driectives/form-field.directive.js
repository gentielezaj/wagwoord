import Vue from 'vue';
// TODO: check if filed is number with pattern
var formField = {
    name: 'form-field',
    update: function (el, attr, vnode) {
        if (!el.validity.valid && el.getAttribute('touched') == 'true') {
            el.parentNode.classList.add('error');
        } else {
            el.parentNode.classList.remove('error');
        }
    },
    inserted(el, attr, vnode) {
        el.addEventListener('focus', event => {
            el.setAttribute('touched', 'true');
        });
        el.addEventListener('focusout', event => {
            if (!el.validity.valid && el.getAttribute('touched') == 'true') {
                el.parentNode.classList.add('error');
            } else {
                el.parentNode.classList.remove('error');
            }
        });
    }
};

Vue.directive('form-field', formField);