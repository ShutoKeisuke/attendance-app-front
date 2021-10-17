<template>
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
                        <v-row justify="end">
                            <v-btn>aaa</v-btn>
                            <v-btn class="ml-4" color="info" @click="defaultSettingClick">基本情報設定</v-btn>
                        </v-row>
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
                        <div v-else-if="props.event.name === '振替' && props.event.category === '振出'" class="pl-1 ml-1">
                          {{ props.event.category }} : {{ props.eventParsed.start.time ? props.eventParsed.start.time : ""}} - {{ props.eventParsed.end.time===props.eventParsed.start.time ? "" : props.eventParsed.end.time }}
                        </div>
                        <div v-else-if="props.event.name === '振替' && props.event.category === '振休'" class="pl-1 ml-1">
                          {{ props.event.category }}
                        </div>
                        <div v-else-if="props.event.name === '欠勤'" class="pl-1 ml-1">
                          {{ props.event.name }}
                        </div>
                      </template>
                    </v-calendar>
                    
                </v-sheet>
            </v-col>
        </v-row>
        <v-row justify="center">
            <!-- <v-overlay v-model="selectedOpen"> -->
            <v-dialog v-model="selectedOpen" max-width="900" persistent>
              <v-card  :light="true">
                <v-card-title>勤怠詳細編集</v-card-title>
                <v-card-text>
                <v-container>
                <v-row>
                  <v-col cols="4">
                    <v-select
                      label="勤務形態"
                      v-model="attendanceEditInfo.workStyleSelected"
                      :items="workStyles"
                      :error-messages="workStyleSelectedErrors"
                      @change="$v.attendanceEditInfo.workStyleSelected.$touch()"
                      @blur="$v.attendanceEditInfo.workStyleSelected.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col v-if="attendanceEditInfo.workStyleSelected === '前休' || attendanceEditInfo.workStyleSelected === '後休'" cols="4">
                    <v-menu
                      ref="paidVacationTimeMenu"
                      v-model="paidVacationTimeMenu"
                      :close-on-content-click="false"
                      :return-value.sync="attendanceEditInfo.paidVacationTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="有給取得時間"
                          v-model="attendanceEditInfo.paidVacationTime"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :error-messages="paidVacationTimeErrors"
                          @change="$v.attendanceEditInfo.paidVacationTime.$touch()"
                          @blur="$v.attendanceEditInfo.paidVacationTime.$touch()"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        format="24hr"
                        v-if="paidVacationTimeMenu"
                        v-model="attendanceEditInfo.paidVacationTime"
                        full-width
                        @click:minute="$refs.paidVacationTimeMenu.save(attendanceEditInfo.paidVacationTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col v-if="attendanceEditInfo.workStyleSelected === '振替'" cols="4">
                    <v-checkbox
                      v-model="attendanceEditInfo.transferAttendanceFlg"
                      label="振替出勤"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="4">
                    <v-menu
                      ref="startTimeMenu"
                      v-model="startTimeMenu"
                      :close-on-content-click="false"
                      :return-value.sync="attendanceEditInfo.startTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="出勤時間"
                          :disabled="!attendanceDepartureBreakFlg"
                          v-model="attendanceEditInfo.startTime"
                          @change="$v.attendanceEditInfo.startTime.$touch()"
                          @blur="$v.attendanceEditInfo.startTime.$touch()"
                          :error-messages="startTimeErrors"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        format="24hr"
                        v-if="startTimeMenu"
                        v-model="attendanceEditInfo.startTime"
                        full-width
                        @click:minute="$refs.startTimeMenu.save(attendanceEditInfo.startTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <v-menu
                      ref="endTimeMenu"
                      v-model="endTimeMenu"
                      :close-on-content-click="false"
                      :return-value.sync="attendanceEditInfo.endTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="退勤時間"
                          :disabled="!attendanceDepartureBreakFlg"
                          v-model="attendanceEditInfo.endTime"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        format="24hr"
                        v-if="endTimeMenu"
                        v-model="attendanceEditInfo.endTime"
                        @click:minute="$refs.endTimeMenu.save(attendanceEditInfo.endTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <v-menu
                      ref="breakTimeMenu"
                      v-model="breakTimeMenu"
                      :close-on-content-click="false"
                      :return-value.sync="attendanceEditInfo.breakTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="休憩時間（規定）"
                          :disabled="!attendanceDepartureBreakFlg"
                          v-model="attendanceEditInfo.breakTime"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        format="24hr"
                        v-if="breakTimeMenu"
                        v-model="attendanceEditInfo.breakTime"
                        @click:minute="$refs.breakTimeMenu.save(attendanceEditInfo.breakTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="4">
                    <v-checkbox
                      v-model="attendanceEditInfo.nonRegularBreakTimeFlg"
                      label="休憩有無（規定外）"
                      :disabled="!attendanceDepartureBreakFlg"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="4">
                    <v-select
                      label="休憩種別（規定外）"
                      :disabled="!attendanceEditInfo.nonRegularBreakTimeFlg"
                      v-model="attendanceEditInfo.nonRegularBreakTimeSelected"
                      :items="nonRegularBreakTimeList"
                      :error-messages="nonRegularBreakTimeSelectedErrors"
                      @change="$v.attendanceEditInfo.nonRegularBreakTimeSelected.$touch()"
                      @blur="$v.attendanceEditInfo.nonRegularBreakTimeSelected.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-menu
                      ref="nonRegularBreakTimeMenu"
                      v-model="nonRegularBreakTimeMenu"
                      :close-on-content-click="false"
                      :return-value.sync="attendanceEditInfo.nonRegularBreakTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="休憩時間（規定外）"
                          :disabled="!attendanceEditInfo.nonRegularBreakTimeFlg"
                          v-model="attendanceEditInfo.nonRegularBreakTime"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :error-messages="nonRegularBreakTimeErrors"
                          @change="$v.attendanceEditInfo.nonRegularBreakTime.$touch()"
                          @blur="$v.attendanceEditInfo.nonRegularBreakTime.$touch()"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        format="24hr"
                        v-if="nonRegularBreakTimeMenu"
                        v-model="attendanceEditInfo.nonRegularBreakTime"
                        full-width
                        @click:minute="$refs.nonRegularBreakTimeMenu.save(attendanceEditInfo.nonRegularBreakTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea
                      solo
                      label="勤怠情報"
                      :disabled="!workStyleSelectedFlg"
                      v-model="attendanceEditInfo.remarks"
                      :error-messages="remarksErrors"
                      @change="$v.attendanceEditInfo.remarks.$touch()"
                      @blur="$v.attendanceEditInfo.remarks.$touch()"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row justify="end">
                  <v-col cols="2">
                    <v-btn @click="cancel" width="100">cancel</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn @click="attendanceEditInfoSubmit" :disabled="false" color="primary" width="100">save</v-btn>
                  </v-col>
                </v-row>
                </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-row>
        <v-row>
          {{ $store.state.DefaultSetting.defaultSettingSelected }}
        </v-row>
        <DefaultSettingDialog />
      
        </v-container>
    </v-layout>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
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
            attendanceBasicInfo: {}, // attendnace basic information
            attendanceFlg: false,
            workStyles: ['通常', '休日', '有給', '前休', '後休', '特有', '振替', '欠勤'], // work style list
            nonRegularBreakTimeList: ['時間内私用', '時間外', '深夜（22 ~ 29時）'], // non-regular breaktime list
            attendanceEditInfo: { // attendance information is for edit
              workStyleSelected: null,
              startTime: null,
              endTime: null,
              breakTime: null,
              nonRegularBreakTimeSelected: null, // selected non-regular break type
              nonRegularBreakTimeFlg: false,
              nonRegularBreakTime: null,
              paidVacationTime: null,
              transferAttendanceFlg: false,
              remarks: null
            },
            attendanceSubmitInfo: {
              attendanceCommonSubmitInfo: {
                userId: null,
                year: null,
                month: null,
                day: null,
                workStyle: null
              },
              attendanceBasicSubmitInfo: {
                startTime: null,
                endTime: null,
                breakTime: null
              },
              breakTimeDetailSubmitInfo: {
                nonRegularBreakTimeFlg: false,
                nonRegularBreakType: null,
                nonRegularBreakTime: null
              },
              paidVacationSubmitInfo: {
                paidVacationTime: null
              },
              remarksSubmitInfo: {
                remarks: null
              }
            },
            startTimeMenu: false,
            endTimeMenu: false,
            breakTimeMenu: false,
            nonRegularBreakTimeMenu: false,
            paidVacationTimeMenu: false,
            nonRegularBreakTimeFlg: false,
            nonRegularBreakTimeSelected: null,
            transferAttendanceFlg: false,
            breakTimeDetail: { // break time details information from DB
              date: null,
              breakType: null,
              breakTime: null
            },
            breakTimeDetailExist: false, // whether break time detail exists
            paidVacation: { // paid vacation information from DB
              date: null,
              paidVacationTime: null
            },
            paidVacationExist: false, // whether paid vacation exists
            attendanceRemarks: { // attendance remarks information from DB
              date: null,
              remarks: null
            },
            attendanceRemarksExist: false, // whether attendance remarks exists
            defaultSettingFlg: false
        }
    },
    validations: {
      name: { required },
      attendanceEditInfo: {
        workStyleSelected: { required },
        startTime: {
          // start time is required when end time is selected
          required: requiredIf((attendanceEditInfo) => {
            return attendanceEditInfo.endTime !== null
          })
        },
        nonRegularBreakTimeSelected: {
          required: requiredIf((attendanceEditInfo) => {
            return attendanceEditInfo.nonRegularBreakTimeFlg
          })
         },
         nonRegularBreakTime: {
          required: requiredIf((attendanceEditInfo) => {
            return attendanceEditInfo.nonRegularBreakTimeFlg
          })
         },
         paidVacationTime: {
          required: requiredIf((attendanceEditInfo) => {
             if(attendanceEditInfo.workStyleSelected === '前休' || attendanceEditInfo.workStyleSelected === '後休') return true
            return false
          })
         },
         remarks: {
           required: requiredIf((attendanceEditInfo) => {
             if(attendanceEditInfo.workStyleSelected === '振替' || attendanceEditInfo.workStyleSelected === '欠勤') return true
            return false
          })
         }
      }
      
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
      },
      workStyleSelectedErrors() {
        const errors = []
        if (!this.$v.attendanceEditInfo.workStyleSelected.$dirty) return errors
        !this.$v.attendanceEditInfo.workStyleSelected.required && errors.push('Work Style is required')
        return errors
      },
      startTimeErrors() {
        const errors = []
        if (!this.$v.attendanceEditInfo.startTime.$dirty) return errors
        !this.$v.attendanceEditInfo.startTime.required && errors.push('start time is required when end time is selected')
        return errors
      },
      nonRegularBreakTimeSelectedErrors() {
        const errors = []
        if (!this.$v.attendanceEditInfo.nonRegularBreakTimeSelected.$dirty) return errors
        !this.$v.attendanceEditInfo.nonRegularBreakTimeSelected.required && errors.push('Break Time Style is required')
        return errors
      },
      nonRegularBreakTimeErrors() {
        const errors = []
        if (!this.$v.attendanceEditInfo.nonRegularBreakTime.$dirty) return errors
        !this.$v.attendanceEditInfo.nonRegularBreakTime.required && errors.push('Break Time is required')
        return errors
      },
      paidVacationTimeErrors() {
        const errors = []
        if (!this.$v.attendanceEditInfo.paidVacationTime.$dirty) return errors
        !this.$v.attendanceEditInfo.paidVacationTime.required && errors.push('Paid Vacation Time is required')
        return errors
      },
      remarksErrors() {
        const errors = []
        if (!this.$v.attendanceEditInfo.remarks.$dirty) return errors
        !this.$v.attendanceEditInfo.remarks.required && errors.push('remarks is required')
        return errors
      },
      attendanceDepartureBreakFlg() {
        if(this.attendanceEditInfo.workStyleSelected === '通常'
          || this.attendanceEditInfo.workStyleSelected === '前休'
          || this.attendanceEditInfo.workStyleSelected === '後休'
          || (this.attendanceEditInfo.workStyleSelected === '振替'
            && this.attendanceEditInfo.transferAttendanceFlg)) return true
        return false
      },
      workStyleSelectedFlg() {
        if(this.attendanceEditInfo.workStyleSelected !== null && this.attendanceEditInfo.workStyleSelected !== '') return true
        return false
      }
    },
    watch: {
      // initialize what is being edited when workStyleSelected changes
      'attendanceEditInfo.workStyleSelected': function(afterVal) {
        this.initAttendanceEditInfo()
        this.initAttendanceEditValidation()
        this.attendanceEditInfo.workStyleSelected = afterVal
        this.$v.attendanceEditInfo.workStyleSelected.$touch()
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
      /*** 
         
      ***/
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
          console.log('prev1')
          await this.setAttendanceBasicInfoByUserId({
            userId: this.userBasicInfo.userId,
            year: this.yearMonth.year,
            month: this.yearMonth.month
          })
          this.attendanceBasicInfo = this.$store.state.AttendanceBasicInfo.attendanceBasicInfo
          this.attendanceFlg = this.$store.state.AttendanceBasicInfo.attendanceFlg
          console.log('prev2')
          this.initEvents()
          this.events = this.$store.state.Events.events
          console.log('prev3')
          this.setEvents()
          this.events = this.$store.state.Events.events
          console.log('prev4')
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
      showEvent (eventObj) {
        const open = () => {
          this.selectedElement = eventObj.nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
        this.setAttendanceEditDay(eventObj.eventParsed.start.day)
        this.setAttendanceEditInfo(eventObj.eventParsed.start.day)
      },
      showDay (clickDateInfo) {
        if( clickDateInfo.month === 12 && this.yearMonth.month == 1 ) {
          this.prev()
        } else if( clickDateInfo.month === 1 && this.yearMonth.month == 12 ) {
          this.next()
        } else if( clickDateInfo.month < this.yearMonth.month ) {
          this.prev()
        } else if( clickDateInfo.month > this.yearMonth.month ) {
          this.next()
        } else {
          this.selectedOpen = !this.selectedOpen
        }
        this.setAttendanceEditDay(clickDateInfo.day)
        this.setAttendanceEditInfo(clickDateInfo.day)
      },
      cancel() {
        this.selectedOpen = !this.selectedOpen
        // console.log('click cancel')
      },
      async attendanceEditInfoSubmit() {
        // validation check
        let validationErrorFlg = false

        // workStyleSelected is required
        if( this.attendanceEditInfo.workStyleSelected === null ) {
          this.$v.attendanceEditInfo.workStyleSelected.$touch()
          return
        
        // when '通常' or '前休' or '後休' is selected as the work style
        } else if( this.attendanceEditInfo.workStyleSelected === '通常'
                    || this.attendanceEditInfo.workStyleSelected === '前休'
                    || this.attendanceEditInfo.workStyleSelected === '後休' ) {
          // init validation error flg
          validationErrorFlg = false

          // start time is required when end time is writen
          if( this.attendanceEditInfo.startTime === null && this.attendanceEditInfo.endTime !== null ) {
            this.$v.attendanceEditInfo.startTime.$touch()
            validationErrorFlg = true
          }

          // nonregular breaktime check
          if( this.attendanceEditInfo.nonRegularBreakTimeFlg ) {
            if( this.attendanceEditInfo.nonRegularBreakTimeSelected === null
                || this.attendanceEditInfo.nonRegularBreakTime === null ) {
              this.$v.attendanceEditInfo.nonRegularBreakTimeSelected.$touch()
              this.$v.attendanceEditInfo.nonRegularBreakTime.$touch()
              validationErrorFlg = true
            }
          }

          if( this.attendanceEditInfo.workStyleSelected === '前休'
                || this.attendanceEditInfo.workStyleSelected === '後休') {
            if( this.attendanceEditInfo.paidVacationTime === null ) {
              this.$v.attendanceEditInfo.paidVacationTime.$touch()
              validationErrorFlg = true
            }
          }

          // if there is a problem with validation, do not send attendance data
          if( validationErrorFlg ) {
            return
          }
        
        // when '振替' is selected as the work style
        } else if( this.attendanceEditInfo.workStyleSelected === '振替' ) {

          // init validation error flg
          validationErrorFlg = false

          // remarks is required
          if(this.attendanceEditInfo.remarks === null ) {
            this.$v.attendanceEditInfo.remarks.$touch()
            validationErrorFlg = true
          }

          // when transfer communting is selected
          if( this.attendanceEditInfo.transferAttendanceFlg ) {

            // start time is required when end time is writen
            if( this.attendanceEditInfo.startTime === null && this.attendanceEditInfo.endTime !== null ) {
              this.$v.attendanceEditInfo.startTime.$touch()
              validationErrorFlg = true
            }

            // nonregular breaktime check
            if( this.attendanceEditInfo.nonRegularBreakTimeFlg ) {
              if( this.attendanceEditInfo.nonRegularBreakTimeSelected === null
                  || this.attendanceEditInfo.nonRegularBreakTime === null ) {
                this.$v.attendanceEditInfo.nonRegularBreakTimeSelected.$touch()
                this.$v.attendanceEditInfo.nonRegularBreakTime.$touch()
                validationErrorFlg = true
              }
            }
          }

          // if there is a problem with validation, do not send attendance data
          if( validationErrorFlg ) {
            return
          }
        
        // when '欠勤' is selected as the work style
        } else if( this.attendanceEditInfo.workStyleSelected === '欠勤' ) {

          // init validation error flg
          validationErrorFlg = false

          // remarks is required
          if(this.attendanceEditInfo.remarks === null ) {
            this.$v.attendanceEditInfo.remarks.$touch()
            validationErrorFlg = true
          }

          // if there is a problem with validation, do not send attendance data
          if( validationErrorFlg ) {
            return
          }
        }

        // if there is no problem with the validation check, get common attendance information
        this.attendanceSubmitInfo.attendanceCommonSubmitInfo = {
          userId: this.$store.state.UserInfo.userBasicInfo.userId,
          year: this.$store.state.DateInfo.yearMonth.year,
          month: this.$store.state.DateInfo.yearMonth.month,
          day: this.$store.state.AttendanceEditInfo.attendanceEditDay,
          workStyle: this.attendanceEditInfo.workStyleSelected,
        }
        
        // when this work style is '通常' or '前休' or '後休'
        // get normal attendance information
        if(this.attendanceEditInfo.workStyleSelected === '通常'
          || this.attendanceEditInfo.workStyleSelected === '前休'
          || this.attendanceEditInfo.workStyleSelected === '後休'
          || (this.attendanceEditInfo.workStyleSelected === '振替'
            && this.attendanceEditInfo.transferAttendanceFlg)) {
          this.attendanceSubmitInfo.attendanceBasicSubmitInfo = {
            startTime: this.attendanceEditInfo.startTime ? this.attendanceEditInfo.startTime : null,
            endTime: this.attendanceEditInfo.endTime ? this.attendanceEditInfo.endTime : null,
            breakTime: this.attendanceEditInfo.breakTime ? this.attendanceEditInfo.breakTime : null
          }

          if(this.attendanceEditInfo.workStyleSelected === '前休'
            || this.attendanceEditInfo.workStyleSelected === '後休') {
            this.attendanceSubmitInfo.paidVacationSubmitInfo = {
              paidVacationTime: this.attendanceEditInfo.paidVacationTime ? this.attendanceEditInfo.paidVacationTime : null
            }
          }
          // if you have selected a non-regular break
          // get non-regular break information
          if(this.attendanceEditInfo.nonRegularBreakTimeFlg) {
            this.attendanceSubmitInfo.breakTimeDetailSubmitInfo = {
              nonRegularBreakTimeFlg: this.attendanceEditInfo.nonRegularBreakTimeFlg,
              nonRegularBreakType: this.attendanceEditInfo.nonRegularBreakTimeSelected ? this.attendanceEditInfo.nonRegularBreakTimeSelected : null,
              nonRegularBreakTime: this.attendanceEditInfo.nonRegularBreakTime ? this.attendanceEditInfo.nonRegularBreakTime : null
            }
          }

          // if there is a description in the remarks column, get remarks
          this.attendanceSubmitInfo.remarksSubmitInfo = {
            remarks: this.attendanceEditInfo.remarks ? this.attendanceEditInfo.remarks : null
          }
        } else if(this.attendanceEditInfo.workStyleSelected === '休日'
          || this.attendanceEditInfo.workStyleSelected === '有給'
          || this.attendanceEditInfo.workStyleSelected === '特有'
          || (this.attendanceEditInfo.workStyleSelected === '振替'
            && !this.attendanceEditInfo.transferAttendanceFlg)
          || this.attendanceEditInfo.workStyleSelected === '欠勤') {
          // if there is a description in the remarks column, get remarks
          this.attendanceSubmitInfo.remarksSubmitInfo = {
            remarks: this.attendanceEditInfo.remarks ? this.attendanceEditInfo.remarks : null
          }
        }

        await this.postAttendanceSubmitInfo(this.attendanceSubmitInfo)

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

        this.initAttendanceSubmitInfo()
        this.initAttendanceEditInfo()

        this.selectedOpen = !this.selectedOpen
      },
      initAttendanceSubmitInfo() {
        this.attendanceSubmitInfo = {
          attendanceCommonSubmitInfo: {
            userId: null,
            year: null,
            month: null,
            day: null,
            workStyle: null
          },
          attendanceBasicSubmitInfo: {
            startTime: null,
            endTime: null,
            breakTime: null
          },
          breakTimeDetailSubmitInfo: {
            nonRegularBreakTimeFlg: false,
            nonRegularBreakType: null,
            nonRegularBreakTime: null
          },
          paidVacationSubmitInfo: {
            paidVacationTime: null
          },
          remarksSubmitInfo: {
            remarks: null
          }
        }
      },
      initAttendanceEditInfo() {
        this.attendanceEditInfo = {
          workStyleSelected: null,
          startTime: null,
          endTime: null,
          breakTime: null,
          nonRegularBreakTimeSelected: null,
          nonRegularBreakTimeFlg: false,
          nonRegularBreakTime: null,
          paidVacationTime: null,
          transferAttendanceFlg: false,
          remarks: null
        }
      },
      initAttendanceEditValidation() {
        this.$v.attendanceEditInfo.$reset()
      },
      async setAttendanceEditInfo(day) {
        console.log('Called setAttendanceEditInfo')
        // get non-regular breaktime information
        await this.getBreakTimeDetail({attendanceId: this.attendanceBasicInfo.attendanceId, date: `${this.yearMonth.year}-${this.adjustAddZeroHead(this.yearMonth.month)}-${this.adjustAddZeroHead(day)}`})
        this.breakTimeDetailExist = this.$store.state.BreakTimeDetail.breakTimeDetailExist
        // if non-regular breaktime information exists, set non-regular breaktime information
        if(this.breakTimeDetailExist) {
          this.breakTimeDetail = this.$store.state.BreakTimeDetail.breakTimeDetail
        }
        // get paid vacation information
        await this.getPaidVacation({attendanceId: this.attendanceBasicInfo.attendanceId, date: `${this.yearMonth.year}-${this.adjustAddZeroHead(this.yearMonth.month)}-${this.adjustAddZeroHead(day)}`})
        this.paidVacationExist = this.$store.state.PaidVacation.paidVacationExist
        // if paid vacation information exist, set paid vacation information 
        if(this.paidVacationExist) {
          this.paidVacation = this.$store.state.PaidVacation.paidVacation
        }
        // get attendance remarks information
        await this.getAttendanceRemarks({attendanceId: this.attendanceBasicInfo.attendanceId, date: `${this.yearMonth.year}-${this.adjustAddZeroHead(this.yearMonth.month)}-${this.adjustAddZeroHead(day)}`})
        this.attendanceRemarksExist = this.$store.state.AttendanceRemarks.attendanceRemarksExist
        // if attendance remarks information exist, set attendance remarks information 
        if(this.attendanceRemarksExist) {
          this.attendanceRemarks = this.$store.state.AttendanceRemarks.attendanceRemarks
        }
        this.attendanceEditInfo = {
          workStyleSelected: this.events[(day - 1)*2].name 
                                        ? this.events[(day - 1)*2].name !== "未入力"
                                          ? this.events[(day - 1)*2].name
                                          : null
                                        : null,
          startTime: this.events[(day - 1)*2].start
                                        ? this.events[(day - 1)*2].name === "通常"
                                          ? this.events[(day - 1)*2].category === "startTimeIsNotNull"
                                            ? this.localDateTimeForLocalTime(this.events[(day - 1)*2].start)
                                            : null
                                          : this.events[(day - 1)*2].name === "前休"
                                            ? this.localDateTimeForLocalTime(this.events[(day - 1)*2].start)
                                            : this.events[(day - 1)*2].name === "後休"
                                              ? this.localDateTimeForLocalTime(this.events[(day - 1)*2].start)
                                              : this.events[(day - 1)*2].name === "振替"
                                                ? this.events[(day - 1)*2].category === "振出"
                                                  ? this.localDateTimeForLocalTime(this.events[(day - 1)*2].start)
                                                  : null
                                                : null
                                        : null,
          endTime:  this.events[(day - 1)*2].end
                                        ? this.localDateTimeForLocalTime(this.events[(day - 1)*2].end)
                                        : null,
          breakTime: this.breakTimeEvents[day - 1],
          nonRegularBreakTimeSelected: this.breakTimeDetailExist
                                        ? this.breakTimeDetail.breakType
                                        : null,
          nonRegularBreakTimeFlg: this.breakTimeDetailExist,
          nonRegularBreakTime: this.breakTimeDetailExist
                                        ? this.breakTimeDetail.breakTime
                                        : null,
          paidVacationTime: this.paidVacationExist
                                        ? this.paidVacation.paidVacationTime
                                        : null,
          transferAttendanceFlg: this.events[(day - 1)*2].name === "振替"
                                        ? this.events[(day - 1)*2].category === "振出"
                                          ? true
                                          : false
                                        : false,
          remarks: this.attendanceRemarksExist
                                        ? this.attendanceRemarks.remarks
                                        : null
        }
      },
      localDateTimeForLocalTime(localDateTime) {
        // console.log(localDateTime.toTimeString())
        return(localDateTime.toTimeString().substr(0,5))
      },
      defaultSettingClick() {
        this.toggleDefaultSettingSelected()
      },
      ...mapMutations('DateInfo', [
        'setYearMonth',
        'setLastDay'
      ]),
      ...mapMutations('AttendanceEditInfo', [
        'setAttendanceEditDay'
      ]),
      ...mapActions('UserInfo', [
          'setUserBasicInfoByEmail'
      ]),
      ...mapActions('AttendanceBasicInfo', [
          'setAttendanceBasicInfoByUserId',
          'postAttendanceSubmitInfo'
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
      ...mapActions('BreakTimeDetail', [
          'getBreakTimeDetail'
      ]),
      ...mapActions('PaidVacation', [
          'getPaidVacation'
      ]),
      ...mapActions('AttendanceRemarks', [
          'getAttendanceRemarks'
      ]),
      ...mapActions('DefaultSetting', [
          'toggleDefaultSettingSelected'
      ]),
      ...mapGetters('LoginInfo', [
        'getLoginInfo'
      ]),
    }
}
</script>