<template>
    <!-- <v-data-table
        :headers="headers"
        :items="items"
        disable-pagination
        hide-default-footer
    ></v-data-table> -->
    <v-layout>
      <v-container>
        <v-row justify="center">
            <v-col cols="8">
                <v-sheet height="64">
                    <v-toolbar flat>
                        <v-btn fab text small coler="gray darken-2" @click="prev">
                            <v-icon small>mdi-chevron-left</v-icon>
                        </v-btn>
                        
                        <v-btn fab text small coler="gray darken-2" @click="next">
                            <v-icon small>mdi-chevron-right</v-icon>
                        </v-btn>
                        <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
                    </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                    <v-calendar
                        ref="calendar"
                        v-model="focus"
                        color="primary"
                        :events="events"
                        @click:event="showEvent"
                        @click:day="showDay"
                        @click:date="showDay"
                        type="month"
                    >
                      <template class="ml-1" v-slot:event="props">
                        <div v-if="props.event.name === '通常'" class="pl-1 ml-1">
                          {{ props.event.name }} : {{ props.eventParsed.start.time ? props.eventParsed.start.time : ""}} - {{ props.eventParsed.end.time===props.eventParsed.start.time ? "" : props.eventParsed.end.time }}
                        </div>
                        <div v-else-if="props.event.name === '未入力'" class="pl-1 ml-1">
                          {{ props.event.name }}
                        </div>
                        <div v-else-if="props.event.name === '休日'" class="pl-1 ml-1">
                          {{ props.event.name }}
                        </div>
                        <div v-else-if="props.event.name === '休憩'" class="pl-1 ml-1">
                          {{ props.event.name }} : {{ breakTimeEvents[props.eventParsed.start.day - 1] }}
                        </div>
                        <div v-else-if="props.event.name === '有給'" class="pl-1 ml-1">
                          {{ props.event.name }}
                        </div>
                        <div v-else-if="props.event.name === '前休'" class="pl-1 ml-1">
                          {{ props.event.name }} : {{ props.eventParsed.start.time ? props.eventParsed.start.time : ""}} - {{ props.eventParsed.end.time===props.eventParsed.start.time ? "" : props.eventParsed.end.time }}
                        </div>
                        <div v-else-if="props.event.name === '後休'" class="pl-1 ml-1">
                          {{ props.event.name }} : {{ props.eventParsed.start.time ? props.eventParsed.start.time : ""}} - {{ props.eventParsed.end.time===props.eventParsed.start.time ? "" : props.eventParsed.end.time }}
                        </div>
                        <div v-else-if="props.event.name === '特有'" class="pl-1 ml-1">
                          {{ props.event.name }}
                        </div>
                        <div v-else-if="props.event.name === '特無'" class="pl-1 ml-1">
                          {{ props.event.name }}
                        </div>
                      </template>
                    </v-calendar>
                    
                </v-sheet>
            </v-col>
        </v-row>
        <v-row>
          <v-overlay v-model="selectedOpen">
            <v-card v-model="selectedOpen" :light="true" height="400">
              <v-card-title>勤怠詳細編集</v-card-title>
              <v-row justify="space-around">
                <v-col cols="5">
                  <v-text-field label="Name" dense v-model="name" :error-messages="nameErrors" @input="$v.name.$touch()" @blur="$v.name.$touch()"></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field dense></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="space-around">
                <v-col cols="5">
                  <v-text-field dense></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field dense></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="space-around">
                <v-col cols="5">
                  <v-text-field dense></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field dense></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="space-around">
                <v-col cols="4">
                  <v-btn @click="cancel">cancel</v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn @click="submit">submit</v-btn>
                </v-col>
              </v-row>
            </v-card>
        </v-overlay>
        </v-row>
        <!-- <v-row>
          <v-col>
            {{ $store.state.UserInfo.userBasicInfo }}
          </v-col>
        </v-row> -->
        <!-- <v-row>
          <v-col>
            <v-btn @click="clickTest()">test</v-btn>
          </v-col>
        </v-row> -->
        </v-container>
    </v-layout>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import {mapMutations, mapActions, mapGetters} from 'vuex'

import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export default {
    data() {
        return {
            focus: '',
            type: 'month',
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            name: '',
            userBasicInfo: {},
            yearMonth: {
              year: 0,
              month: 0
            },
            lastDay: 0,
            events: [],
            breakTimeEvents: [],
            loginInfo: {
              email: ''
            },
            attendanceBasicInfo: {},
            attendanceFlg: false
        }
    },
    validations: {
      name: { required }
    },
    mounted() {
        console.log('mounted called')
        this.$refs.calendar.checkChange()
        setTimeout(() => {
          this.init()
        }, 0)
        
    },
    created() {
      console.log('created called')
      // this.init()
    },
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      }
    },
    methods: {
      async init() {
        console.log('init called')
        // Get the year and month when first displayed
        this.initYearMonth()

        // Get information about logged-in users
        await this.setUserBasicInfoByEmail(this.$store.state.LoginInfo.loginInfo.email)
        this.userBasicInfo = this.$store.state.UserInfo.userBasicInfo

        // Get this month's attendance information for logged-in users
        await this.setAttendanceBasicInfoByUserId({
          userId: this.userBasicInfo.userId,
          year: this.yearMonth.year,
          month: this.yearMonth.month
        })
        this.attendanceBasicInfo = this.$store.state.AttendanceBasicInfo.attendanceBasicInfo
        // Acquire existence of attendance information
        this.attendanceFlg = this.$store.state.AttendanceBasicInfo.attendanceFlg

        // Get the number of days of the month
        this.setLastDay(this.yearMonth)
        this.lastDay = this.$store.state.DateInfo.lastDay


        this.initEvents()
        this.events = this.$store.state.Events.events


        this.setEvents()
        this.events = this.$store.state.Events.events

        this.setBreakTimeEvents()
        this.breakTimeEvents = this.$store.state.Events.breakTimeEvents
      },
      // Get the year and month when first displayed
      initYearMonth() {
        console.log('initYearMonth')
        if(this.$refs.calendar.title.length === 7) {
          this.yearMonth.month = Number(this.$refs.calendar.title.substr(0,1))
          this.yearMonth.year = Number(this.$refs.calendar.title.substr(3,4))
        } else {
          this.yearMonth.month = Number(this.$refs.calendar.title.substr(0,2))
          this.yearMonth.year = Number(this.$refs.calendar.title.substr(4,4))
        }
        // Save the acquired date in the store
        this.setYearMonth(this.yearMonth)
      },
      adjustAddZeroHead(num) {
        if(String(num).length === 1) {
          return `0${num}`
        }
        return String(num)
      },
      async prev() {
          console.log('prev')
          this.$refs.calendar.prev()
          this.prevYearMonth(this.yearMonth)
          this.yearMonth = this.$store.state.DateInfo.yearMonth
          this.setLastDay(this.yearMonth)
          this.lastDay = this.$store.state.DateInfo.lastDay
          await this.setAttendanceBasicInfoByUserId({
            userId: this.userBasicInfo.userId,
            year: this.yearMonth.year,
            month: this.yearMonth.month
          })
          this.attendanceBasicInfo = this.$store.state.AttendanceBasicInfo.attendanceBasicInfo
          this.attendanceFlg = this.$store.state.AttendanceBasicInfo.attendanceFlg
          this.initEvents()
          this.events = this.$store.state.Events.events
          this.setEvents()
          this.events = this.$store.state.Events.events
          this.setBreakTimeEvents()
          this.breakTimeEvents = this.$store.state.Events.breakTimeEvents
      },
      async next() {
          console.log('next')
          this.$refs.calendar.next()
          this.nextYearMonth(this.yearMonth)
          this.yearMonth = this.$store.state.DateInfo.yearMonth
          this.setLastDay(this.yearMonth)
          this.lastDay = this.$store.state.DateInfo.lastDay
          await this.setAttendanceBasicInfoByUserId({
            userId: this.userBasicInfo.userId,
            year: this.yearMonth.year,
            month: this.yearMonth.month
          })
          this.attendanceBasicInfo = this.$store.state.AttendanceBasicInfo.attendanceBasicInfo
          this.attendanceFlg = this.$store.state.AttendanceBasicInfo.attendanceFlg
          this.initEvents()
          this.events = this.$store.state.Events.events
          this.setEvents()
          this.events = this.$store.state.Events.events
          this.setBreakTimeEvents()
          this.breakTimeEvents = this.$store.state.Events.breakTimeEvents
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
      },
      showDay (clickDateInfo) {
        if(clickDateInfo.month < this.yearMonth.month) {
          this.prev()
        } else if (clickDateInfo.month > this.yearMonth.month) {
          this.next()
        } else {
          this.selectedOpen = !this.selectedOpen
        }
      },
      cancel() {
        this.selectedOpen = !this.selectedOpen
        // console.log('click cancel')
      },
      submit() {
        // console.log('click submit')
      },
      ...mapMutations('DateInfo', [
        'setYearMonth',
        'setLastDay'
      ]),
      ...mapActions('UserInfo', [
          'setUserBasicInfoByEmail'
      ]),
      ...mapActions('AttendanceBasicInfo', [
          'setAttendanceBasicInfoByUserId'
      ]),
      ...mapActions('DateInfo', [
        'nextYearMonth',
        'prevYearMonth'
      ]),
      ...mapActions('Events', [
        'testAtions',
        'initEvents',
        'setEvents',
        'setBreakTimeEvents'
      ]),
      ...mapGetters('LoginInfo', [
        'getLoginInfo'
      ]),
      
      clickTest() {
        console.log('test click')
        console.log(JSON.parse(localStorage.getItem('attendance-api-vuex-state-key')))
        // var params = new URLSearchParams()
        // params.append('userId', String(11111111))
        // params.append('year', 2021)
        // params.append('month', 7)
        // api.get("/attendance", { params: {
        //     userId: '11111111',
        //     year: 2021,
        //     month: 7
        //   }
        // })
        // .then(res => {
        //   console.log('success')
        //   console.log(res)
        // })
        // .catch(error => {
        //   console.log('faild')
        //   console.log(error)
        // })
      }
    }
    // data() {
    //     return {
    //         headers: [
    //             {
    //                 text: '日付',
    //                 value: 'date',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '曜日',
    //                 value: 'day',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '勤務形態',
    //                 value: 'workStyle',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '基準始業時間',
    //                 value: 'StdStartTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '基準終業時間',
    //                 value: 'StdEndTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '始業時間',
    //                 value: 'startTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '終業時間',
    //                 value: 'endTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '規定(休憩)',
    //                 value: 'regularBreakTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '時間内私用(休憩)',
    //                 value: 'privateInTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '時間外(休憩)',
    //                 value: 'offHours',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '深夜(休憩)',
    //                 value: 'midnightBreakTime',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '所定内(勤務時間)',
    //                 value: 'scheduledWorking',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '所定外(勤務時間)',
    //                 value: 'overtimeWorking',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '深夜(勤務時間)',
    //                 value: 'midnightWorking',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '有給休暇',
    //                 value: 'paidHolidays',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '出張',
    //                 value: 'businessTrip',
    //                 aligin: 'center'
    //             },
    //             {
    //                 text: '備考',
    //                 value: 'remarks',
    //                 aligin: 'center'
    //             }
    //         ],
    //         items: []
    //     }
    // },
    // created() {
    //     for(let i = 0; i < 30; i++) {
    //         this.items.push({
    //             date: '6/1',
    //             day: '月',
    //             workStyle: '平日',
    //             StdStartTime: '9:00',
    //             StdEndTime: '18:00',
    //             startTime: '9:00',
    //             endTime: '18:00',
    //             regularBreakTime: '1:00',
    //             privateInTime: '0:00',
    //             offHours: '0:00',
    //             midnightBreakTime: '0:00',
    //             scheduledWorking: '8:00',
    //             overtimeWorking: '0:00',
    //             midnightWorking: '0:00',
    //             paidHolidays: '0:00',
    //             businessTrip: '0:00',
    //             remarks: '備考'
    //         })
    //     }
    // }
}
</script>