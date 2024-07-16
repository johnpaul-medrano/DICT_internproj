import { createRouter, createWebHistory } from "vue-router";
import { createStore } from 'vuex';
import { db, storage } from "@/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import workforceLogo from '@/assets/workforcey.png';
import sparkLogo from '@/assets/sparky.png';
import tech4edLogo from '@/assets/tech4edy.png';
import Login from "../pages/login.vue"; // Adjust the path relative to router/index.js
import { getCurrentUser } from "@/firebaseConfig";

// Vuex Store
const store = createStore({
  state: {
    logo: {
      workforce: workforceLogo,
      spark: sparkLogo,
      tech4ed: tech4edLogo,
    },
    currentLogo: '',
    tableData: [],
  },
  mutations: {
    setLogo(state, logo) {
      state.logo = logo;
    },
    SET_TABLE_DATA(state, payload) {
      state.tableData = payload;
    },
  },
  actions: {
    updateLogo({ commit }, logo) {
      commit('setLogo', logo);
    },
    async fetchInitialTableData({ commit }) {
      try {
        const listRef = ref(storage, 'purchase_requests/');
        const res = await listAll(listRef);
        const files = await Promise.all(res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { prnum: itemRef.name, downloadURL: url };
        }));
        console.log('Fetched initial data:', files);
        commit('SET_TABLE_DATA', files);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    },
    listenToTableData({ commit }) {
      const purchaseRequestsRef = collection(db, "purchase_requests");
      onSnapshot(purchaseRequestsRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Updated data:', data);
        commit('SET_TABLE_DATA', data);
      }, (error) => {
        console.error('Error listening to data:', error);
      });
    },
  },
  getters: {
    currentLogo: (state) => state.logo,
    tableData: (state) => state.tableData,
  },
});

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

export { router, store };
