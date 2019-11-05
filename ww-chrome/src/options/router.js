/* eslint-disable indent */
import Vue from 'vue';
import VueRouter from 'vue-router';

import PasswordPage from './pages/password';
import CodeGeneratorPage from './pages/code-generator';
import AddressPage from './pages/address';
import CreditCardPage from './pages/credit-card';
import BlacklistPage from './pages/blacklist';
import SettingsPage from './pages/settings';
import DemoPage from './pages/demo';
import TestPage from './pages/test';

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
