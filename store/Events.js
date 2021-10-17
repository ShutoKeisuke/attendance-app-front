export const state = () => ({
    events: [],
    breakTimeEvents: [],
    test: ''
})

export const mutations = {
    initEvents(state, payload) {
        state.events = []
        console.log(payload)
        state.events = payload
    },
    setEvents(state, payload) {
        payload.forEach((item, index) => {
            state.events[index] = item
        })
    },
    setBreakTimeEvents(state, payload) {
        state.breakTimeEvents = []
        state.breakTimeEvents = payload
    }
}

export const actions = {
    // initialize using the maximum number of days and months currently registered in the store
    initEvents({rootState, commit}) {
        let events = []
        const adjustAddZeroHead = (num) => {
            if(String(num).length === 1) return `0${num}`
            return String(num)
        }
        for( let i = 0; i < (rootState.DateInfo.lastDay)*2; i++ ) {
            if( i % 2 === 0 ) {
                events[i] = {
                    name: '未入力',
                    start: new Date(`${rootState.DateInfo.yearMonth.year}-${adjustAddZeroHead(rootState.DateInfo.yearMonth.month)}-${adjustAddZeroHead((i+2)/2)}T00:00:00`),
                    color: 'grey'
                }
            }
        }
        commit('initEvents', events)
    },
    setEvents({rootState, commit}) {
        let events = []
        const adjustAddZeroHead = (num) => {
            if(String(num).length === 1) return `0${num}`
            return String(num)
        }
        if(rootState.AttendanceBasicInfo.attendanceFlg) {
            rootState.AttendanceBasicInfo.attendanceBasicInfo.attendanceList.forEach((item, index) => {
                if(index >= rootState.DateInfo.lastDay) {return}
                // workStyle === 通常
                if(item.workStyle === "通常") {
                    if(item.startTime !== null) {
                        events[index*2] = {
                        name: item.workStyle,
                        start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.startTime}`),
                        color: 'indigo',
                        timed: true,
                        category: 'startTimeIsNotNull'
                        }
                    } 
                    if(item.endTime !== null) {
                        events[index*2].end = new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.endTime}`)
                    }
                    if(item.startTime === null && item.endTime === null) {
                        events[index*2] = {
                        name: item.workStyle,
                        start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T00:00:00`),
                        color: 'indigo',
                        category: 'startTimeIsNull'
                        }
                    }
                // workStyle === 休日
                } else if(item.workStyle === "休日") {
                    events[index*2] = {
                        name: item.workStyle,
                        start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T00:00:00`),
                        color: 'brown',
                        timed: true
                    }
                // workStyle === 前休
                } else if(item.workStyle === "前休") {
                    if(item.startTime !== null) {
                        events[index*2] = {
                            name: item.workStyle,
                            start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.startTime}`),
                            color: 'purple',
                            timed: true
                        }
                    } 
                    if(item.endTime !== null) {
                        events[index*2].end = new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.endTime}`)
                    } 
                // workStyle === 後休
                } else if(item.workStyle === "後休") {
                    if(item.startTime !== null) {
                        events[index*2] = {
                            name: item.workStyle,
                            start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.startTime}`),
                            color: 'purple',
                            timed: true
                        }
                    } 
                    if(item.endTime !== null) {
                        events[index*2].end = new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.endTime}`)
                    }
                // workStyle === 有給 || 特有 || 特無
                } else if(item.workStyle === "有給" || item.workStyle === "特有" || item.workStyle === "特無") {
                    events[index*2] = {
                        name: item.workStyle,
                        start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T00:00:00`),
                        color: 'pink',
                        timed: true
                    }
                } else if(item.workStyle === "振替") {
                    if(item.startTime != null) {
                        events[index*2] = {
                            name: item.workStyle,
                            start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T${item.startTime}`),
                            color: 'light-green',
                            timed: true,
                            category: "振出"
                        }
                    } else {
                        events[index*2] = {
                            name: item.workStyle,
                            start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T00:00:00`),
                            color: 'light-green',
                            timed: true,
                            category: "振休"
                        }
                    }
                    
                } else if(item.workStyle === "欠勤") {
                    events[index*2] = {
                        name: item.workStyle,
                        start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T00:00:00`),
                        color: 'red',
                        timed: true
                    }
                }
                if(item.breakTime !== null) {
                    events[index*2 + 1] = {
                        name: '休憩',
                        start: new Date(`${rootState.AttendanceBasicInfo.attendanceBasicInfo.year}-${adjustAddZeroHead(rootState.AttendanceBasicInfo.attendanceBasicInfo.month)}-${adjustAddZeroHead(index + 1)}T23:59:59`),
                        color: 'green',
                        timed: true
                    }
                }
            })
            commit('setEvents', events)
        }
    },
    setBreakTimeEvents({rootState, commit}) {
        let breakTimeEvents = []
        for( let i = 0; i < rootState.DateInfo.lastDay; i++ ) {
          if(rootState.AttendanceBasicInfo.attendanceBasicInfo.attendanceList[i].breakTime !== null) {
            breakTimeEvents[i] = rootState.AttendanceBasicInfo.attendanceBasicInfo.attendanceList[i].breakTime
          }
        }
        commit('setBreakTimeEvents', breakTimeEvents)
    },
    testAtions({rootState, dispatch}, payload) {
        // console.log(rootState.LoginInfo.loginInfo.email)
        dispatch('DateInfo/testAction', null, {root: true})
    }
}