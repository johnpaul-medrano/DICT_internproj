import { createStore } from 'vuex';

import { db, storage } from "@/firebaseConfig";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
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
        purchaseOrders: []
    },
    mutations: {
        setLogo(state, logo) {
            state.logo = logo;
        },
        SET_TABLE_DATA(state, payload) {
            state.tableData = payload;
        },
        SET_PURCHASE_ORDERS(state, payload) {
            state.purchaseOrders = payload;
        }
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
        async fetchInitialPurchaseOrders({ commit }) {
            try {
                const querySnapshot = await getDocs(collection(db, "purchase_orders"));
                const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Fetched initial purchase orders:', orders);
                commit('SET_PURCHASE_ORDERS', orders);
            } catch (error) {
                console.error('Error fetching initial purchase orders:', error);
            }
        },
        listenToPurchaseOrders({ commit }) {
            const purchaseOrdersRef = collection(db, "purchase_orders");
            onSnapshot(purchaseOrdersRef, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Updated purchase orders:', data);
                commit('SET_PURCHASE_ORDERS', data);
            }, (error) => {
                console.error('Error listening to purchase orders:', error);
            });
        },
    },
    getters: {
        currentLogo: (state) => state.logo,
        tableData: (state) => state.tableData,
        purchaseOrders: (state) => state.purchaseOrders
    }
});

export { store }
