import createPersistedState from 'vuex-persistedstate'
 
export default ({ store }) => {
 
    window.onNuxtReady(() => {
        createPersistedState({
            key: 'attendance-api-vuex-state-key'
        })(store)
    })
}