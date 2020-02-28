/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
// export const state = () => ({
// 	painter: undefined,
// });

// export const getters = {};

// export const mutations = {
// 	setPainter(state, painter) {
// 		state.painter = painter;
// 	},
// };

// export const actions = {};

export default {
	state: () => ({
		painter: undefined,
	}),
	getters: {},
	mutations: {
		setPainter(state, painter) {
			state.painter = painter;
		},
		callPainterMethod(state, { method, payload }) {
			state.painter[method](payload);
		},
	},
	actions: {
		callPainterMethod({ commit }, payload) {
			commit('callPainterMethod', payload);
		},
	},
};
