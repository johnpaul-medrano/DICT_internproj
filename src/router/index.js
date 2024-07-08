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
    path: "/mainpage/:logo",
    name: "MainPage",
    component: () => import("../pages/mainpage.vue"),
    children: [
      {
        path: "prformSVP",
        name: "PrFormSVP",
        component: () => import("../pages/tabs/prformsvp.vue"),
        props: true,
      },
      {
        path: "prformFB",
        name: "PrFormFB",
        component: () => import("../pages/tabs/prformfb.vue"),
        props: true,
      },
      {
        path: "monitoring",
        name: "Monitoring",
        component: () => import("../pages/tabs/monitoring.vue"),
        props: true,
      },
      {
        path: "suppliers-database",
        name: "SuppliersDatabase",
        component: () => import("../pages/tabs/suppliers-database.vue"),
        props: true,
      },
      {
        path: "templates",
        name: "Templates",
        component: () => import("../pages/tabs/templates.vue"),
        props: true,
      },
      {
        path: "request",
        name: "Request",
        component: () => import("../pages/tabs/request.vue"),
        props: true,
      },
    ],
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
