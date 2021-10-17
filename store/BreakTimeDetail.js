import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export const state = () => ({
    breakTimeDetail: {
        date: null,
        breakType: null,
        breakTime: null
    },
    breakTimeDetailExist: false
})

export const mutations = {
    getBreakTimeDetail(state, payload) {
        state.breakTimeDetailExist = true
        state.breakTimeDetail.date = payload.date
        state.breakTimeDetail.breakType = payload.break_type
        state.breakTimeDetail.breakTime = payload.break_time
    },
    faildGetBreakTimeDetail(state) {
        state.breakTimeDetailExist = false
    }
}

export const actions = {
    async getBreakTimeDetail({commit}, payload) {
        await api.get('/attendance/break', {
            params: {
                attendanceId: payload.attendanceId,
                date: payload.date
            }
        })
        .then(response => {
            if(response.data) {
                commit('getBreakTimeDetail', response.data)
            } else {
                commit('faildGetBreakTimeDetail')
            }
        })
        .catch(error => {
            console.log(`error BreakTimeDetail/getBreakTimeDetail : ${error}`)
            commit('faildGetBreakTimeDetail')
        })
    }
}