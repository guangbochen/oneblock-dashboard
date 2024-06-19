import Vue from 'vue';
import Router from 'vue-router';
import { normalizeURL } from 'ufo';
import { interopDefault } from '../utils/nuxt';
import scrollBehavior from '../utils/router.scrollBehavior.js';

const emptyFn = () => {};

export const linkActiveClass = 'nuxt-link-active';

Vue.use(Router);

export const routerOptions = {
  mode:                 'history',
  // Note: router base comes from the ROUTER_BASE env var
  base:                 process.env.routerBase || '/',
  linkActiveClass,
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path:      '/about',
    component: () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */)),
    name:      'about'
  }, {
    path:      '/c',
    component: () => interopDefault(import('../pages/c/index.vue' /* webpackChunkName: "pages/c/index" */)),
    name:      'c'
  }, {
    path:      '/clusters',
    component: () => interopDefault(import('../pages/clusters/index.vue' /* webpackChunkName: "pages/clusters/index" */)),
    name:      'clusters'
  }, {
    path:      '/diagnostic',
    component: () => interopDefault(import('../pages/diagnostic.vue' /* webpackChunkName: "pages/diagnostic" */)),
    name:      'diagnostic'
  }, {
    path:      '/fail-whale',
    component: () => interopDefault(import('../pages/fail-whale.vue' /* webpackChunkName: "pages/fail-whale" */)),
    name:      'fail-whale'
  }, {
    path:      '/home',
    component: () => interopDefault(import('../pages/home.vue' /* webpackChunkName: "pages/home" */)),
    name:      'home'
  }, {
    path:      '/prefs',
    component: () => interopDefault(import('../pages/prefs.vue' /* webpackChunkName: "pages/prefs" */)),
    name:      'prefs'
  }, {
    path:      '/support',
    component: () => interopDefault(import('../pages/support/index.vue' /* webpackChunkName: "pages/support/index" */)),
    name:      'support'
  }, {
    path:      '/auth/login',
    component: () => interopDefault(import('../pages/auth/login.vue' /* webpackChunkName: "pages/auth/login" */)),
    name:      'auth-login'
  }, {
    path:      '/auth/logout',
    component: () => interopDefault(import('../pages/auth/logout.vue' /* webpackChunkName: "pages/auth/logout" */)),
    name:      'auth-logout'
  }, {
    path:      '/auth/setup',
    component: () => interopDefault(import('../pages/auth/setup.vue' /* webpackChunkName: "pages/auth/setup" */)),
    name:      'auth-setup'
  }, {
    path:      '/auth/verify',
    component: () => interopDefault(import('../pages/auth/verify.vue' /* webpackChunkName: "pages/auth/verify" */)),
    name:      'auth-verify'
  }, {
    path:      '/c/:cluster',
    component: () => interopDefault(import('../pages/c/_cluster/index.vue' /* webpackChunkName: "pages/c/_cluster/index" */)),
    name:      'c-cluster'
  }, {
    path:      '/c/:cluster/auth',
    component: () => interopDefault(import('../pages/c/_cluster/auth/index.vue' /* webpackChunkName: "pages/c/_cluster/auth/index" */)),
    name:      'c-cluster-auth'
  }, {
    path:      '/c/:cluster/explorer',
    component: () => interopDefault(import('../pages/c/_cluster/explorer/index.vue' /* webpackChunkName: "pages/c/_cluster/explorer/index" */)),
    name:      'c-cluster-explorer'
  }, {
    path:      '/c/:cluster/manager',
    component: () => interopDefault(import('../pages/c/_cluster/manager/index.vue' /* webpackChunkName: "pages/c/_cluster/manager/index" */)),
    name:      'c-cluster-manager'
  }, {
    path:      '/c/:cluster/settings',
    component: () => interopDefault(import('../pages/c/_cluster/settings/index.vue' /* webpackChunkName: "pages/c/_cluster/settings/index" */)),
    name:      'c-cluster-settings'
  }, {
    path:      '/c/:cluster/auth/config',
    component: () => interopDefault(import('../pages/c/_cluster/auth/config/index.vue' /* webpackChunkName: "pages/c/_cluster/auth/config/index" */)),
    name:      'c-cluster-auth-config'
  }, {
    path:      '/c/:cluster/auth/roles',
    component: () => interopDefault(import('../pages/c/_cluster/auth/roles/index.vue' /* webpackChunkName: "pages/c/_cluster/auth/roles/index" */)),
    name:      'c-cluster-auth-roles'
  }, {
    path:      '/c/:cluster/explorer/ConfigBadge',
    component: () => interopDefault(import('../pages/c/_cluster/explorer/ConfigBadge.vue' /* webpackChunkName: "pages/c/_cluster/explorer/ConfigBadge" */)),
    name:      'c-cluster-explorer-ConfigBadge'
  }, {
    path:      '/c/:cluster/explorer/EventsTable',
    component: () => interopDefault(import('../pages/c/_cluster/explorer/EventsTable.vue' /* webpackChunkName: "pages/c/_cluster/explorer/EventsTable" */)),
    name:      'c-cluster-explorer-EventsTable'
  }, {
    path:      '/c/:cluster/explorer/explorer-utils',
    component: () => interopDefault(import('../pages/c/_cluster/explorer/explorer-utils.js' /* webpackChunkName: "pages/c/_cluster/explorer/explorer-utils" */)),
    name:      'c-cluster-explorer-explorer-utils'
  }, {
    path:      '/c/:cluster/manager/cloudCredential',
    component: () => interopDefault(import('../pages/c/_cluster/manager/cloudCredential/index.vue' /* webpackChunkName: "pages/c/_cluster/manager/cloudCredential/index" */)),
    name:      'c-cluster-manager-cloudCredential'
  }, {
    path:      '/c/:cluster/settings/banners',
    component: () => interopDefault(import('../pages/c/_cluster/settings/banners.vue' /* webpackChunkName: "pages/c/_cluster/settings/banners" */)),
    name:      'c-cluster-settings-banners'
  }, {
    path:      '/c/:cluster/settings/brand',
    component: () => interopDefault(import('../pages/c/_cluster/settings/brand.vue' /* webpackChunkName: "pages/c/_cluster/settings/brand" */)),
    name:      'c-cluster-settings-brand'
  }, {
    path:      '/c/:cluster/settings/DefaultLinksEditor',
    component: () => interopDefault(import('../pages/c/_cluster/settings/DefaultLinksEditor.vue' /* webpackChunkName: "pages/c/_cluster/settings/DefaultLinksEditor" */)),
    name:      'c-cluster-settings-DefaultLinksEditor'
  }, {
    path:      '/c/:cluster/settings/links',
    component: () => interopDefault(import('../pages/c/_cluster/settings/links.vue' /* webpackChunkName: "pages/c/_cluster/settings/links" */)),
    name:      'c-cluster-settings-links'
  }, {
    path:      '/c/:cluster/settings/performance',
    component: () => interopDefault(import('../pages/c/_cluster/settings/performance.vue' /* webpackChunkName: "pages/c/_cluster/settings/performance" */)),
    name:      'c-cluster-settings-performance'
  }, {
    path:      '/c/:cluster/auth/group.principal/assign-edit',
    component: () => interopDefault(import('../pages/c/_cluster/auth/group.principal/assign-edit.vue' /* webpackChunkName: "pages/c/_cluster/auth/group.principal/assign-edit" */)),
    name:      'c-cluster-auth-group.principal-assign-edit'
  }, {
    path:      '/c/:cluster/manager/cloudCredential/create',
    component: () => interopDefault(import('../pages/c/_cluster/manager/cloudCredential/create.vue' /* webpackChunkName: "pages/c/_cluster/manager/cloudCredential/create" */)),
    name:      'c-cluster-manager-cloudCredential-create'
  }, {
    path:      '/c/:cluster/auth/config/:id',
    component: () => interopDefault(import('../pages/c/_cluster/auth/config/_id.vue' /* webpackChunkName: "pages/c/_cluster/auth/config/_id" */)),
    name:      'c-cluster-auth-config-id'
  }, {
    path:      '/c/:cluster/manager/cloudCredential/:id',
    component: () => interopDefault(import('../pages/c/_cluster/manager/cloudCredential/_id.vue' /* webpackChunkName: "pages/c/_cluster/manager/cloudCredential/_id" */)),
    name:      'c-cluster-manager-cloudCredential-id'
  }, {
    path:      '/c/:cluster/manager/pages/:page?',
    component: () => interopDefault(import('../pages/c/_cluster/manager/pages/_page.vue' /* webpackChunkName: "pages/c/_cluster/manager/pages/_page" */)),
    name:      'c-cluster-manager-pages-page'
  }, {
    path:      '/c/:cluster/auth/roles/:resource/create',
    component: () => interopDefault(import('../pages/c/_cluster/auth/roles/_resource/create.vue' /* webpackChunkName: "pages/c/_cluster/auth/roles/_resource/create" */)),
    name:      'c-cluster-auth-roles-resource-create'
  }, {
    path:      '/c/:cluster/auth/roles/:resource/:id?',
    component: () => interopDefault(import('../pages/c/_cluster/auth/roles/_resource/_id.vue' /* webpackChunkName: "pages/c/_cluster/auth/roles/_resource/_id" */)),
    name:      'c-cluster-auth-roles-resource-id'
  }, {
    path:      '/c/:cluster/navlinks/:group?',
    component: () => interopDefault(import('../pages/c/_cluster/navlinks/_group.vue' /* webpackChunkName: "pages/c/_cluster/navlinks/_group" */)),
    name:      'c-cluster-navlinks-group'
  }, {
    path:      '/c/:cluster/:product',
    component: () => interopDefault(import('../pages/c/_cluster/_product/index.vue' /* webpackChunkName: "pages/c/_cluster/_product/index" */)),
    name:      'c-cluster-product'
  }, {
    path:      '/c/:cluster/:product/members',
    component: () => interopDefault(import('../pages/c/_cluster/_product/members/index.vue' /* webpackChunkName: "pages/c/_cluster/_product/members/index" */)),
    name:      'c-cluster-product-members'
  }, {
    path:      '/c/:cluster/:product/namespaces',
    component: () => interopDefault(import('../pages/c/_cluster/_product/namespaces.vue' /* webpackChunkName: "pages/c/_cluster/_product/namespaces" */)),
    name:      'c-cluster-product-namespaces'
  }, {
    path:      '/c/:cluster/:product/projectsnamespaces',
    component: () => interopDefault(import('../pages/c/_cluster/_product/projectsnamespaces.vue' /* webpackChunkName: "pages/c/_cluster/_product/projectsnamespaces" */)),
    name:      'c-cluster-product-projectsnamespaces'
  }, {
    path:      '/c/:cluster/:product/:resource',
    component: () => interopDefault(import('../pages/c/_cluster/_product/_resource/index.vue' /* webpackChunkName: "pages/c/_cluster/_product/_resource/index" */)),
    name:      'c-cluster-product-resource'
  }, {
    path:      '/c/:cluster/:product/:resource/create',
    component: () => interopDefault(import('../pages/c/_cluster/_product/_resource/create.vue' /* webpackChunkName: "pages/c/_cluster/_product/_resource/create" */)),
    name:      'c-cluster-product-resource-create'
  }, {
    path:      '/c/:cluster/:product/:resource/:id',
    component: () => interopDefault(import('../pages/c/_cluster/_product/_resource/_id.vue' /* webpackChunkName: "pages/c/_cluster/_product/_resource/_id" */)),
    name:      'c-cluster-product-resource-id'
  }, {
    path:      '/c/:cluster/:product/:resource/:namespace/:id?',
    component: () => interopDefault(import('../pages/c/_cluster/_product/_resource/_namespace/_id.vue' /* webpackChunkName: "pages/c/_cluster/_product/_resource/_namespace/_id" */)),
    name:      'c-cluster-product-resource-namespace-id'
  }, {
    path:      '/',
    component: () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */)),
    name:      'index'
  }],

  fallback: false
};

export function createRouter(config) {
  const base = (config._app && config._app.basePath) || routerOptions.base;
  const router = new Router({ ...routerOptions, base });

  // TODO: remove in Nuxt 3
  const originalPush = router.push;

  router.push = function push(location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort);
  };

  const resolve = router.resolve.bind(router);

  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to);
    }
    console.log('resolve', to, current, append);
    return resolve(to, current, append);
  };

  return router;
}
