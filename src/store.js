import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersistence({
	storage: localStorage,
});

export default new Vuex.Store({
	state: {
		manifest: undefined,
	},
	mutations: {
		RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION,
		setManifest(state, payload) {
			state.manifest = payload;
		},
	},
	actions: {
		setManifest({ commit }, payload) {
			commit('setManifest', payload);
		},
	},
	plugins: [vuexPersist.plugin],
});
