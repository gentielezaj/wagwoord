/* eslint-disable indent */
import Vue from 'vue';
import VueRouter from 'vue-router';

import PasswordPage from '../shared/pages/password';
import CodeGeneratorPage from '../shared/pages/code-generator';

const routes = [{
        path: '/',
        component: PasswordPage,
        props: {
            removeHeader: true,
            removeForm: true
        }
    },
    {
        path: '/code-generator',
        component: CodeGeneratorPage,
        props: {
            removeHeader: true,
            removeForm: true
        }
    }
];

Vue.use(VueRouter);

export default new VueRouter({
    routes
});
