import Vue from 'vue';

function updateVue(el, attr, vnode) {
    let searchInput = vnode.context.header.searchInput;
    let searchableElements = el.querySelectorAll('[search-data]');
    let counter = 0;
    searchableElements.forEach(element => {
        let searchValue = element.getAttribute('search-data');
        if (!searchValue || !searchInput) {
            element.classList.remove('search-hide');
            return;
        }
        searchInput = searchInput.toLowerCase();
        let searchFor = searchValue.indexOf(' ') > -1 ? searchValue.toLowerCase().split(' ') : [searchValue];
        if (searchFor.filter(s => s.indexOf(searchInput) > -1).length) {
            element.classList.remove('search-hide');
        } else {
            element.classList.add('search-hide');
            counter++;
        }
    });
    if(searchableElements.length === counter && counter !== 0) {
        el.classList.add('search-hide');
    } else {
        el.classList.remove('search-hide');
    }
}

const pageSearch = {
    name: 'searchable',
    inserted: function (el, attr, vnode) {
        updateVue(el, attr, vnode);
    },
    update: function (el, attr, vnode) {
        updateVue(el, attr, vnode);
    }
};

Vue.directive('searchable', pageSearch);
