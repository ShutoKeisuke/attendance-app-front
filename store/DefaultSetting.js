import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export const state = () => ({
    defaultSettingSelected: false,
    defaultSettingEditInfo: {
        attendanceFormatSetting: {
            userId: null,
            formatStartTime: null,
            formatEndTime: null,
            formatBreakTime: null,
            formatHolidayDayOfWeek: ['日', '土'],
            formatOverWrite: false
        }
    }
})

export const mutations = {
    toggleDefaultSettingSelected(state) {
        state.defaultSettingSelected = !state.defaultSettingSelected
    },

    getAttendanceFormatSettingInfo(state, payload) {
        state.defaultSettingEditInfo.attendanceFormatSetting = {
            userId: payload.user_id,
            formatStartTime: payload.format_start_time,
            formatEndTime: payload.format_end_time,
            formatBreakTime: payload.format_break_time,
            formatHolidayDayOfWeek: payload.format_holiday_day_of_week,
            formatOverWrite: payload.format_over_write
        }
    }
}

export const actions = {
    toggleDefaultSettingSelected({commit}) {
        commit('toggleDefaultSettingSelected')
    },

    async postAttendanceFormatSave({}, payload) {
        await api.post('/attendance/format/setting', payload, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => {
            console.log('SUCCESS : postAttendanceFormatSave')
            console.log(response)
        })
        .catch(error => {
            console.log('FAILD : postAttendanceFormatSave')
            console.log(error)
        })
    },

    async getAttendanceFormatSettingInfo({commit}, payload) {
        await api.get('/attendance/format/setting', { params: { userId: payload } })
        .then(response => {
            console.log('SUCCESS : getAttendanceFormatSettingInfo')
            console.log(response)
            commit('getAttendanceFormatSettingInfo', response.data)
        })
        .catch(error => {
            console.log('FAILD : getAttendanceFormatSettingInfo')
            console.log(error)
        })

    },

    async postAttendanceFormat({}, payload) {
        await api.post('/attendance/format', payload, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => {
            console.log('SUCCESS : postAttendanceFormat')
            console.log(response)
        })
        .catch(error => {
            console.log('FAILD : postAttendanceFormat')
            console.log(error)
        }) 
    }
}

export const getters = {
    getDefaultSettingSelected(state) {
        return state.defaultSettingSelected
    },
    getAttendanceFormatStartTime(state) {
        return state.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime
    },
    getAttendanceFormatEndTime(state) {
        return state.defaultSettingEditInfo.attendanceFormatSetting.formatEndTime
    },
    getAttendanceFormatBreakTime(state) {
        return state.defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime
    }
}