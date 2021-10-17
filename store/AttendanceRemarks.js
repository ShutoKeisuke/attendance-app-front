import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export const state = () => ({
    attendanceRemarks: {
        date: null,
        remarks: null
    },
    attendanceRemarksExist: false
})

export const mutations = {
    getAttendanceRemarks(state, payload) {
        state.attendanceRemarksExist = true
        state.attendanceRemarks.date = payload.date
        state.attendanceRemarks.remarks = payload.remarks
    },
    faildGetAttendanceRemarks(state) {
        state.attendanceRemarksExist = false
    }
}

export const actions = {
    async getAttendanceRemarks({commit}, payload) {
        await api.get('/attendance/remarks', {
            params: {
                attendanceId: payload.attendanceId,
                date: payload.date
            }
        }) 
        .then(response => {
            if(response.data) {
                commit('getAttendanceRemarks', response.data)
            } else {
                commit('faildGetAttendanceRemarks')
            }
        })
        .catch(error => {
            console.log(`error AttendanceRemarks/getAttendanceRemarks : ${error}`)
            commit('faildGetAttendanceRemarks')
        })
    }
}