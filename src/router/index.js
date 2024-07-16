import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/login.vue"; // Adjust the path relative to router/index.js
import { getCurrentUser } from "@/firebaseConfig";

// Vue Router
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
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "Projects",
    component: () => import("../pages/projects.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/mainpage/:logo",
    name: "MainPage",
    component: () => import("../pages/mainpage.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "prformSVP",
        name: "PrFormSVP",
        component: () => import("../pages/tabs/prformsvp.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "prformFB",
        name: "PrFormFB",
        component: () => import("../pages/tabs/prformfb.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "monitoring",
        name: "Monitoring",
        component: () => import("../pages/tabs/monitoring.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "budget_approval",
        name: "Budget_Approval",
        component: () => import("../pages/tabs/budget_approval.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "TOD_approval",
        name: "tod_Approval",
        component: () => import("../pages/tabs/TOD_approval.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "suppliers-database",
        name: "SuppliersDatabase",
        component: () => import("../pages/tabs/suppliers-database.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "templates",
        name: "Templates",
        component: () => import("../pages/tabs/templates.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "request",
        name: "Request",
        component: () => import("../pages/tabs/request.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      
    ],
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Router config for RouteGuard in Login to disable change of URL for unauthorized access
router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !(await getCurrentUser())) {
    return "/";
  }
});

export { router };
