import Vue from 'vue';

var collapse = {
    name: 'collapse',
    inserted: function (el, attr, vnode) {
        const content = el.querySelector(attr.value);
        if (content) {
            el.firstElementChild.classList.add('pointer');
            el.firstElementChild.classList.add('down-icon');
            el.firstElementChild.addEventListener('click', event => {
                if(event.target.tagName == 'BUTTON' || event.target.tagName == 'INPUT') return;
                if(content.classList.contains('hidden')) {
                    content.classList.remove('hidden');
                    el.firstElementChild.classList.add('down-icon');
                    el.firstElementChild.classList.remove('up-icon');
                } else {
                    content.classList.add('hidden');
                    el.firstElementChild.classList.remove('down-icon');
                    el.firstElementChild.classList.add('up-icon');
                }
            });
        }
    }
};

Vue.directive('collapse', collapse);
