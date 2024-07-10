import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/login.vue"; // Adjust the path relative to router/index.js
import { auth } from "../firebaseConfig";
import { getCurrentUser } from "@/utils";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { requiresAuth: true },
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

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = await getCurrentUser();

  if (requiresAuth && !currentUser) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
