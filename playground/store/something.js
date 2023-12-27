export const actions = {
    nuxtClientInit() {
        console.log('client init');
    },
    nuxtServerInit({commit}) {
        console.log('something server init');
        commit('UP');
    },
};
export const state = {
    rr: 45645,
};
export const mutations = {
    UP(state) {
        state.rr = 'wwwwwwwwwwww'
    },
};