export const state = () => ({
    yearMonth: {
        year: 0,
        month: 0
    },
    lastDay: null
})

export const mutations = {
    setYearMonth(state, payload) {
        state.yearMonth = payload
    },
    nextYearMonth(state, payload) {
        if(payload.month === 12) {
            state.yearMonth.year = ++payload.year
            state.yearMonth.month = 1
        } else {
            state.yearMonth.month = ++payload.month
        }
    },
    prevYearMonth(state, payload) {
        if(payload.month === 1) {
            state.yearMonth.year = --payload.year
            state.yearMonth.month = 12
        } else {
            state.yearMonth.month = --payload.month
        }
    },
    setLastDay(state, payload) {
        state.lastDay = new Date(payload.year, payload.month, 0).getDate()
    },
}

export const actions = {
    nextYearMonth({commit}, payload) {
        commit('nextYearMonth', payload)
    },
    prevYearMonth({commit}, payload) {
        commit('prevYearMonth', payload)
    },
    testAction() {
        // console.log('Called Date/testAction')
    }
}