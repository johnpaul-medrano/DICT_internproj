import { createStore } from 'vuex';

import { db, storage } from "@/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";

import workforceLogo from '@/assets/workforcey.png';
import sparkLogo from '@/assets/sparky.png';
import tech4edLogo from '@/assets/tech4edy.png';

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
    }
});

export { store }