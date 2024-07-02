import { createRouter, createWebHistory } from "vue-router";
//import AdminView from "directoryhere";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admin/",
      name: "AdminView",
      //component: () => import("filedirectory"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;