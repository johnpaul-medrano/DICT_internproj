// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import CreateRequest from '@/views/CreateRequest.vue';
import ViewRequests from '@/views/ViewRequests.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: CreateRequest },
    { path: '/requests', component: ViewRequests },
  ],
});
