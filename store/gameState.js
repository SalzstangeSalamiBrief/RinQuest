/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
	actualState: undefined,
});

export const getters = {};
export const mutations = {
	/**
   * Set a new actualState.
   * If no newState is passed, just reset the actual state
   * @param {String} newState
   */
	setActualState(state, newState = undefined) {
		state.actualState = newState;
	},
};
export const actions = {};
