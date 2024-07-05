import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/login.vue"; // Adjust the path relative to router/index.js
import Monitoring from "../pages/tabs/monitoring.vue";

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
    children: [
      {
        path: "prform",
        name: "PrForm",
        component: () => import("../pages/tabs/prform.vue"),
      },
      {
        path: "monitoring",
        name: "Monitoring",
        component: Monitoring,
      },
      {
        path: "suppliers-database",
        name: "SuppliersDatabase",
        component: () => import("../pages/tabs/suppliers-database.vue"),
      },
      {
        path: "templates",
        name: "Templates",
        component: () => import("../pages/tabs/templates.vue"),
      },
      {
        path: "request",
        name: "Request",
        component: () => import("../pages/tabs/request.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
