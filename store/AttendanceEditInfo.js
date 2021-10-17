export const state = () => ({
    attendanceEditDay: null
})

export const mutations = {
    setAttendanceEditDay(state, payload) {
        state.attendanceEditDay = payload
    }
}