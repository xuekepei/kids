import {createStore} from 'vuex'

export default createStore({
    state: {
        token: localStorage.getItem('token') || '',
    },
    getters: {
        token: state => state.token,
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
    },
    actions: {
        setToken({commit}, token) {
            commit('setToken', token)
            localStorage.setItem('token', token)
        },
        logout({commit}) {
            commit('setToken', '')
            localStorage.removeItem('token')
        },
    },
    modules: {

    }
})
