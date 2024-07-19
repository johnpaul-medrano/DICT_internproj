import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/login.vue";
import { getCurrentUser } from "@/firebaseConfig";
import { ref } from 'vue';
import { logout } from "@/firebaseConfig";

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
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "create-account",
        name: "CreateAccount",
        component: () => import("../pages/tabs/admin-create.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "add-template",
        name: "AddTemplate",
        component: () => import("../pages/tabs/admin-add.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
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
        path: "abstract_monitoring",
        name: "Abstract_monitoring",
        component: () => import("../pages/tabs/abstract_monitoring.vue"),
        props: true,
        meta: { requiresAuth: true, requiresSO: true },
      },
      {
        path: "prformSVP",
        name: "PrFormSVP",
        component: () => import("../pages/tabs/prformsvp.vue"),
        props: true,
        meta: { requiresAuth: true, requiresILCDB: true },
      },
      {
        path: "prformFB",
        name: "PrFormFB",
        component: () => import("../pages/tabs/prformfb.vue"),
        props: true,
        meta: { requiresAuth: true, requiresILCDB: true },
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
        meta: { requiresAuth: true, requiresBUDGET: true },
      },
      {
        path: "TOD_approval",
        name: "tod_Approval",
        component: () => import("../pages/tabs/TOD_approval.vue"),
        props: true,
        meta: { requiresAuth: true, requiresTOD: true },
      },
      {
        path: "RD_approval",
        name: "rd_Approval",
        component: () => import("../pages/tabs/RD_approval.vue"),
        props: true,
        meta: { requiresAuth: true, requiresRD: true },
      },
      {
        path: "suppliers-database",
        name: "SuppliersDatabase",
        component: () => import("../pages/tabs/suppliers-database.vue"),
        props: true,
        meta: { requiresAuth: true, requiresILCDB: true },
      },
      {
        path: "templates",
        name: "Templates",
        component: () => import("../pages/tabs/templates.vue"),
        props: true,
        meta: { requiresAuth: true, requiresILCDB: true },
      },
      {
        path: "request",
        name: "Request",
        component: () => import("../pages/tabs/request.vue"),
        props: true,
        meta: { requiresAuth: true, requiresILCDB: true },
      },
      {
        path: "abstract",
        name: "Abstract",
        component: () => import("../pages/tabs/abstract.vue"),
        props: true,
        meta: { requiresAuth: true, requiresSO: true },
      },
      {
        path: "poform",
        name: "PoForm",
        component: () => import("../pages/tabs/SO_poform.vue"),
        props: true,
        meta: { requiresAuth: true, requiresSO: true },
      },
      {
        path: "postatus",
        name: "PoStatus",
        component: () => import("../pages/tabs/PO_Status.vue"),
        props: true,
        meta: { requiresAuth: true, requiresSO: true },
      },
    ],
    props: true,
  },
  { 
    path: '/:pathMatch(.*)*',
    component: () => import("../pages/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const previousRoute = ref("/projects");

// Router config for RouteGuard in Login to disable change of URL for unauthorized access
router.beforeEach(async (to, from) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const requiresILCDB = to.matched.some((record) => record.meta.requiresILCDB);
  const requiresTOD = to.matched.some((record) => record.meta.requiresTOD);
  const requiresBUDGET = to.matched.some(
    (record) => record.meta.requiresBUDGET
  );
  const requiresRD = to.matched.some((record) => record.meta.requiresRD);
  const requiresSO = to.matched.some((record) => record.meta.requiresSO);
  const matchedRoutes = router.getRoutes().map(route => route.path);

  // Store the current route as the previous route before making a change
  // previousRoute.value = from.path;

  // Login Route Guard
  if (requiresAuth && !(await getCurrentUser())) {
    return "/";
  }

  // Router guard to prevent users from forgetting to log out
  if (to.path === "/" && (await getCurrentUser())) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "Admin") {
      return false || "/projects";
    }
    return true;
  }

  // Router guard to prevent admin from forgetting to log out
  if (to.path === "/" && (await getCurrentUser())) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "Repo") {
      return false || "/admin";
    }
    return true;
  }

  // // Router guard to prevent user from going to a blank page or unknown path
  // if (!matchedRoutes.includes(to.path)) {
  //   await logout();
  //   return { path: previousRoute.value };
  // }

  //Admin Route Guard
  // Admin Route Guard
  if (requiresAdmin) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "Admin") {
      return "/projects";
    }
  }

  // Role Route Guards
  if (requiresILCDB) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "ILCDB") {
      return "/projects";
    }
  }

  if (requiresTOD) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "TOD Head") {
      return "/projects";
    }
  }

  if (requiresBUDGET) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "Budget Division") {
      return "/projects";
    }
  }

  if (requiresRD) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "RD") {
      return "/projects";
    }
  }

  if (requiresSO) {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "Supply Office") {
      return "/projects";
    }
  }
});

export { router };
