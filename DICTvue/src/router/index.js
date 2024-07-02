import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/admin/",
      name: "AdminView",
      component: () => import("../pages/admin.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;