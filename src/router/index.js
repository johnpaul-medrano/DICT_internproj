import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/login.vue"; // Adjust the path relative to router/index.js

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../pages/admin.vue"),
  },
  {
    path: "/projects",
    name: "Projects",
    component: () => import("../pages/projects.vue"),
  },
  {
    path: "/mainpage",
    name: "MainPage",
    component: () => import("../pages/mainpage.vue"),
  },
  {
    path: "/prform",
    name: "prform",
    component: () => import("../pages/tabs/prform.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
