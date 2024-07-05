import { createStore } from 'vuex';

import workforceLogo from '@/assets/workforcey.png';
import sparkLogo from '@/assets/sparky.png';
import tech4edLogo from '@/assets/tech4edy.png';

export default createStore({
    state: {
        logo: {
            workforce: workforceLogo,
            spark: sparkLogo,
            tech4ed: tech4edLogo,
        },
        currentLogo: '',
    },
    mutations: {
        setLogo(state, logo) {
            state.logo = logo;
        }
    },
    actions: {
        updateLogo({ commit }, logo) {
            commit('setLogo', logo);
        }
    },
    getters: {
        currentLogo: (state) => state.logo
    }
});