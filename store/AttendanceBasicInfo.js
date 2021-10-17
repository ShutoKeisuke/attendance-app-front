import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export const state = () => ({
    attendanceBasicInfo: {
        attendanceId: null,
        userId: '',
        year: 0,
        month: 0,
        attendanceList: []
    },
    attendanceFlg: false
})

export const mutations = {
    setAttendanceBasicInfoByUserId(state, payload) {
        state.attendanceFlg = true
        state.attendanceBasicInfo.attendanceId = payload.attendance_id
        state.attendanceBasicInfo.userId = payload.user_id
        state.attendanceBasicInfo.year = payload.year
        state.attendanceBasicInfo.month = payload.month
        payload.attendance_list.forEach((item, index) => {
            state.attendanceBasicInfo.attendanceList[index] = {
                workStyle: item.work_style,
                startTime: item.start_time,
                endTime: item.end_time,
                breakTime: item.break_time
            }
        });
    },
    faildGetAttendance(state) {
        state.attendanceFlg = false
    }
}

export const actions = {
    async setAttendanceBasicInfoByUserId({commit}, payload) {
        await api.get('/attendance', {
            params: {
                userId: payload.userId,
                year: payload.year,
                month: payload.month
            }
        })
        .then(response => {
            commit('setAttendanceBasicInfoByUserId', response.data)
        })
        .catch(error => {
            commit('faildGetAttendance')
            console.log(`error AttendanceBasicInfo/setAttendanceBasicInfoByUserId : ${error}`)
        })
    },
    async postAttendanceSubmitInfo({}, payload) {
        console.log('postAttendanceSubmitInfo payload')
        console.log(payload)
        await api.post('/attendance/edit', payload, {
            headers: {
              'content-type': 'application/json',
            }
        })
        .then(response => {
            console.log('SUCCESS : postAttendanceSubmitInfo')
            console.log(response)
        })
        .catch(error => {
            console.log('FAILD : postAttendanceSubmitInfo')
            console.log(error)
        })
    }
}