import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export const state = () => ({
    paidVacation: {
        date: null,
        paidVacationTime: null
    },
    paidVacationExist: false
})

export const mutations = {
    getPaidVacation(state, payload) {
        state.paidVacationExist = true
        state.paidVacation.date = payload.date
        state.paidVacation.paidVacationTime = payload.paid_vacation_time
    },
    faildGetPaidVacation(state) {
        state.paidVacationExist = false
    }
}

export const actions = {
    async getPaidVacation({commit}, payload) {
        await api.get('/attendance/paid', {
            params: {
                attendanceId: payload.attendanceId,
                date: payload.date
            }
        })
        .then(response => {
            if(response.data) {
                commit('getPaidVacation', response.data)
            } else {
                commit('faildGetPaidVacation')
            }
        })
        .catch(error => {
            console.log(`error PaidVacation/getPaidVacation : ${error}`)
            commit('faildGetPaidVacation')
        })
    }
}