// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
// import Home from '../components/Home.vue';
import Projects from "../pages/Projects.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  // { path: "/home", component: Home },
  { path: "/Projects", component: Projects },
  { path: "/admin", component: () => import("../pages/admin.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
