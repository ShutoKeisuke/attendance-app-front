export const state = () => ({
    loginInfo: {
        email: ''
    }
})

export const mutations = {
    updateUserInfo(state, payload) {
        state.loginInfo.email = payload.email
    }
}

export const getters = {
    getLoginInfo(state) {
        return state.loginInfo
    }
}