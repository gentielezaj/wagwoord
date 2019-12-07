import Vue from 'vue';
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
        // if(el.tagName === 'INPUT' && el.type === "number" && el.maxLength > 0) {
        //     el.addEventListener('input', event => {
        //         if(el.value && el.value.length > el.maxLength) {
        //             el.value = el.value.substring(0, el.maxLength);
        //         }
        //     });
        // }
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