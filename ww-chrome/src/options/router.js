/* eslint-disable indent */
import Vue from 'vue';
import VueRouter from 'vue-router';

import PasswordPage from '../shared/pages/password';
import CodeGeneratorPage from '../shared/pages/code-generator';
import AddressPage from '../shared/pages/address';
import CreditCardPage from '../shared/pages/credit-card';
import BlacklistPage from '../shared/pages/blacklist';
import SettingsPage from '../shared/pages/settings';
import DemoPage from '../shared/pages/demo';
import TestPage from '../shared/pages/test';

const routes = [{
        path: '/',
        component: PasswordPage
    },
    {
        path: '/code-generator',
        component: CodeGeneratorPage
    },
    {
        path: '/address',
        component: AddressPage
    },
    {
        path: '/credit-card',
        component: CreditCardPage
    },
    {
        path: '/blacklist',
        component: BlacklistPage
    },
    {
        path: '/settings',
        component: SettingsPage
    },
    {
        path: '/demo',
        component: DemoPage
    },
    {
        path: '/test',
        component: TestPage
    }
];

Vue.use(VueRouter);

export default new VueRouter({
    routes
});
