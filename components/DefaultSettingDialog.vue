<template>
    <v-layout>
        <v-container>
            <v-row>
                <v-dialog v-model="$store.state.DefaultSetting.defaultSettingSelected" max-width="900" persistent>
                    <v-card :light="true">
                        <v-card-title>基本情報設定</v-card-title>
                        <v-card-text>
                            <v-tabs
                                v-model="defaultSettingEditInfo.tabSelected"
                            >
                                <v-tab
                                    v-for="tabItem in tabItems"
                                    :key="tabItem"
                                >
                                    {{ tabItem }}
                                </v-tab>
                            </v-tabs>
                            <v-container v-if="defaultSettingEditInfo.tabSelected === 0">
                                <v-row>
                                    <v-col cols="4">
                                        <v-menu
                                        ref="startTimeMenu"
                                        v-model="editStatus.attendanceFormatSetting.startTimeMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="defaultSettingEditInfo.attendanceFormatSetting.formatStartTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                            label="出勤時間"
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatStartTime"
                                            @change="$v.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime.$touch()"
                                            @blur="$v.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime.$touch()"
                                            :error-messages="formatStartTimeErrors"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
                                            v-if="editStatus.attendanceFormatSetting.startTimeMenu"
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatStartTime"
                                            full-width
                                            @click:minute="$refs.startTimeMenu.save(defaultSettingEditInfo.attendanceFormatSetting.formatStartTime)"
                                        ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-menu
                                        ref="endTimeMenu"
                                        v-model="editStatus.attendanceFormatSetting.endTimeMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="defaultSettingEditInfo.attendanceFormatSetting.formatEndTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                            label="退勤時間"
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatEndTime"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
                                            v-if="editStatus.attendanceFormatSetting.endTimeMenu"
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatEndTime"
                                            full-width
                                            @click:minute="$refs.endTimeMenu.save(defaultSettingEditInfo.attendanceFormatSetting.formatEndTime)"
                                        ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-menu
                                        ref="breakTimeMenu"
                                        v-model="editStatus.attendanceFormatSetting.breakTimeMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                            label="休憩時間"
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            format="24hr"
                                            v-if="editStatus.attendanceFormatSetting.breakTimeMenu"
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime"
                                            full-width
                                            @click:minute="$refs.breakTimeMenu.save(defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime)"
                                        ></v-time-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <!-- <v-col cols="2">
                                        休日を指定
                                    </v-col>
                                    <v-col cols="1" v-for=" (dayOfWeekLabel, index) in dayOfWeekLabels " :key="index">
                                        <v-checkbox
                                        v-model="defaultSettingEditInfo.attendanceFormatSetting.formatHoliday[index]"
                                        :label="dayOfWeekLabel"
                                        ></v-checkbox>
                                    </v-col> -->
                                    <v-col>
                                        <v-combobox
                                            v-model="defaultSettingEditInfo.attendanceFormatSetting.formatHolidayDayOfWeek"
                                            :items="dayOfWeekLabels"
                                            label="休日を指定"
                                            multiple
                                            chips
                                        >
                                        </v-combobox>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-checkbox
                                        v-model="defaultSettingEditInfo.attendanceFormatSetting.formatOverWrite"
                                        label="入力済みの勤怠情報の上書きを行う"
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn
                                            color="info"
                                            :disabled="false"
                                            @click="clickExcuteAttendanceFormat"
                                        >
                                            勤怠フォーマットを適用
                                        </v-btn>
                                        <!-- <v-snackbar
                                            top
                                            timeout="-1"
                                            v-model="editStatus.attendanceFormatSetting.attendanceFormatExcuteAlert"
                                        >
                                            出勤時間 : {{ defaultSettingEditInfo.attendanceFormatSetting.formatStartTime }}<br>
                                            退勤時間
                                            休憩時間
                                        </v-snackbar> -->
                                        <v-tooltip v-model="editStatus.attendanceFormatSetting.formatBtnToolTipFlg" right>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    <v-icon>mdi-information-outline</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>設定された出勤時間・退勤時間・休憩時間で今月の勤怠情報を登録します</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                                <v-row justify="end">
                                    <v-col cols="2">
                                        <v-btn @click="clickCancel" width="100">
                                            cancel
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn @click="clickSave" color="primary" width="100">
                                            save
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row class="mt-5">
                                    {{ defaultSettingEditInfo.attendanceFormatSetting.formatHolidayDayOfWeek }}
                                    <!-- {{ $v }} -->
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row>
                <v-dialog v-model="editStatus.attendanceFormatSetting.attendanceFormatExcuteAlert" max-width="900" persistent>
                    <v-card :light="true">
                        <v-card-title>勤怠フォーマットを適応しますか？</v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row v-if="editStatus.attendanceFormatSetting.attendanceFormatSettingDontSaveFlg">
                                    <v-col>
                                        <v-alert
                                            border="left"
                                            colored-border
                                            type="warning"
                                            elevation="2"
                                        >
                                            勤怠フォーマットが変更されていますが保存されていません。<br>
                                            変更後の勤怠フォーマットを反映し、保存を行う場合は「SUBMIT」ボタンを押して下さい。<br>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="4"></v-col>
                                                    <v-col cols="4">
                                                        変更前 
                                                    </v-col>
                                                    <v-col cols="4">
                                                        変更後
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="4">
                                                        出勤時間
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(getAttendanceFormatStartTime()) }}
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(defaultSettingEditInfo.attendanceFormatSetting.formatStartTime) }}
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="4">
                                                        退勤時間
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(getAttendanceFormatEndTime()) }}
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(defaultSettingEditInfo.attendanceFormatSetting.formatEndTime) }}
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="4">
                                                        休憩時間
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(getAttendanceFormatBreakTime()) }}
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime) }}
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-alert>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-alert
                                            border="left"
                                            colored-border
                                            type="info"
                                            elevation="2"
                                        >
                                            下記の内容で{{ $store.state.DateInfo.yearMonth.year }}年{{ $store.state.DateInfo.yearMonth.month }}月の勤怠フォーマットの登録を行います
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="4">
                                                        出勤時間
                                                    </v-col>
                                                    <v-col cols="4">
                                                        退勤時間
                                                    </v-col>
                                                    <v-col cols="4">
                                                        休憩時間
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(defaultSettingEditInfo.attendanceFormatSetting.formatStartTime) }}
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(defaultSettingEditInfo.attendanceFormatSetting.formatEndTime) }}
                                                    </v-col>
                                                    <v-col cols="4">
                                                        {{ timeHHmmssToHHmm(defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime) }}
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-alert>
                                    </v-col>
                                </v-row>
                                <v-row justify="end">
                                    <v-col cols="2">
                                        <v-btn @click="clickAttendanceFormatSubmitCancel" width="100">
                                            cancel
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn @click="clickAttendanceFormatSubmit" color="primary" width="100">
                                            submit
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-container>
    </v-layout>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import {mapMutations, mapActions, mapGetters} from 'vuex'

export default {
    data() {
        return {
            tabItems: ['勤怠フォーマット', 'bbb', 'ccc'],  // tab item list
            dayOfWeekLabels: ['日', '月', '火', '水', '木', '金', '土'],
            // picker flg for edit someone
            editStatus: {
                attendanceFormatSetting: {
                    startTimeMenu: false,
                    endTimeMenu: false,
                    breakTimeMenu: false,
                    formatBtnToolTipFlg: false,
                    attendanceFormatExcuteAlert: false,
                    attendanceFormatSettingDontSaveFlg: false
                }
            },
            // dialog edit information
            defaultSettingEditInfo: {
                tabSelected: null,  // this is the number of selected tabs
                attendanceFormatSetting: {  // attendnace format setting information
                    userId: null,
                    formatStartTime: null,
                    formatEndTime: null,
                    formatBreakTime: null,
                    formatHolidayDayOfWeek: ['日', '土'],
                    formatOverWrite: false
                }
            }
        }
    },
    validations: {
        defaultSettingEditInfo: {
            attendanceFormatSetting: {
                formatStartTime: {
                    // formatStartTime is required when end time is selected
                    required: requiredIf((attendanceFormatSetting) => {
                        console.log(attendanceFormatSetting)
                        return attendanceFormatSetting.formatEndTime !== null
                    })
                }
            }
        }
    },
    computed: {
        // monitor changes in defaultSettingSelected
        defaultSettingDialogStatus: function() {
            return this.getDefaultSettingSelected()
        },
        // validation error for format start time
        formatStartTimeErrors() {
            const errors = []
            if (!this.$v.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime.$dirty) return errors
            !this.$v.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime.required && errors.push('start time is required when end time selected')
            return errors
        }
    },
    watch: {
        // monitor changes in defaultSettingSelected
        async defaultSettingDialogStatus() {

            // if defaultSettingSelected is true (Dialog Opened), get attendnace format setting information from db
            if(this.$store.state.DefaultSetting.defaultSettingSelected) {

                // excute api for getting attendance format setting information
                await this.getAttendanceFormatSettingInfo(this.$store.state.UserInfo.userBasicInfo.userId)

                console.log(this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting)

                // set attendance format setting information from db
                this.defaultSettingEditInfo.attendanceFormatSetting = {
                    userId: this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting.userId,
                    formatStartTime: this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime,
                    formatEndTime: this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting.formatEndTime,
                    formatBreakTime: this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime,
                    formatHolidayDayOfWeek: this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting.formatHolidayDayOfWeek,
                    formatOverWrite: this.$store.state.DefaultSetting.defaultSettingEditInfo.attendanceFormatSetting.formatOverWrite
                }
            }
        }
    },
    methods: {
        clickCancel() {
            // init defaultSettingEditInfo
            // init attendanceFormatSetting
            this.initAttendanceFormatSetting()

            // init defaultSettingEditInfo Validation
            // init attendanceFormatSetting Validation
            this.initAttendanceFormatSettingValidation()

            // toggle default setting dialog
            this.toggleDefaultSettingSelected()
        },
        async clickSave() {
            // init validation flg
            let validationErrorFlg = false

            // when the attendance format is selected
            if( this.defaultSettingEditInfo.tabSelected === 0 ) {
                // validation check
                if( this.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime === null && this.defaultSettingEditInfo.attendanceFormatSetting.formatEndTime !== null) {
                    this.$v.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime.$touch()
                    validationErrorFlg = true
                }

                // when validation has error, dont submit format setting information
                if(validationErrorFlg) {
                    return
                }

                // update or insert attendance format information
                this.defaultSettingEditInfo.attendanceFormatSetting.userId = this.$store.state.UserInfo.userBasicInfo.userId
                await this.postAttendanceFormatSave(this.defaultSettingEditInfo.attendanceFormatSetting)
            }

            // init defaultSettingEditInfo
            // init attendanceFormatSetting
            this.initAttendanceFormatSetting()

            // init defaultSettingEditInfo Validation
            // init attendanceFormatSetting Validation
            this.initAttendanceFormatSettingValidation()

            // toggle default setting dialog
            this.toggleDefaultSettingSelected()
        },
        clickAttendanceFormatSubmitCancel() {
            this.editStatus.attendanceFormatSetting.attendanceFormatExcuteAlert = false
        },
        clickAttendanceFormatSubmit() {
            let postAttendanceFormatForm = {
                attendanceFormatForm: {
                    userId: this.defaultSettingEditInfo.attendanceFormatSetting.userId,
                    formatStartTime: this.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime,
                    formatEndTime: this.defaultSettingEditInfo.attendanceFormatSetting.formatEndTime,
                    formatBreakTime: this.defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime,
                    formatHolidayDayOfWeek: this.defaultSettingEditInfo.attendanceFormatSetting.formatHolidayDayOfWeek,
                    formatOverWrite: this.defaultSettingEditInfo.attendanceFormatSetting.formatOverWrite
                },
                attendanceFormatFormYearMonth: {
                    year: this.$store.state.DateInfo.yearMonth.year,
                    month: this.$store.state.DateInfo.yearMonth.month
                }
            }
            // postAttendanceFormatForm.attendanceFormatForm = this.defaultSettingEditInfo.attendanceFormatSetting
            // postAttendanceFormatForm.attendanceFormatFormYearMonth.year = this.$store.state.DateInfo.yearMonth.year
            // postAttendanceFormatForm.attendanceFormatFormYearMonth.month = this.$store.state.DateInfo.yearMonth.month
            this.postAttendanceFormat(postAttendanceFormatForm)
            this.editStatus.attendanceFormatSetting.attendanceFormatExcuteAlert = false
        },
        clickExcuteAttendanceFormat() {
            this.attendanceFormatSettingDontSaveJdg()
            this.editStatus.attendanceFormatSetting.attendanceFormatExcuteAlert = true
        },
        initAttendanceFormatSetting() {
            console.log("Called initAttendanceFormatSetting")
            this.defaultSettingEditInfo.attendanceFormatSetting = {
                userId: null,
                formatStartTime: null,
                formatEndTime: null,
                formatBreakTime: null,
                formatHolidayDayOfWeek: [],
                formatOverWrite: false
            }
            console.log(this.defaultSettingEditInfo.attendanceFormatSetting)
        },
        initAttendanceFormatSettingValidation() {
            this.$v.defaultSettingEditInfo.attendanceFormatSetting.$reset()
        },
        attendanceFormatSettingDontSaveJdg() {
            console.log('attendanceFormatSettingDontSaveJdg')
            console.log(this.$store.state.DefaultSetting.defaultSettingEditInfo)
            console.log(this.defaultSettingEditInfo.attendanceFormatSetting)
            if( this.timeHHmmssToHHmm(this.getAttendanceFormatStartTime()) !== this.timeHHmmssToHHmm(this.defaultSettingEditInfo.attendanceFormatSetting.formatStartTime)
                || this.timeHHmmssToHHmm(this.getAttendanceFormatEndTime()) !== this.timeHHmmssToHHmm(this.defaultSettingEditInfo.attendanceFormatSetting.formatEndTime)
                || this.timeHHmmssToHHmm(this.getAttendanceFormatBreakTime()) !== this.timeHHmmssToHHmm(this.defaultSettingEditInfo.attendanceFormatSetting.formatBreakTime) ) {
                console.log('true')
                this.editStatus.attendanceFormatSetting.attendanceFormatSettingDontSaveFlg = true
            } else {
                this.editStatus.attendanceFormatSetting.attendanceFormatSettingDontSaveFlg = false
            }
            
        },
        timeHHmmssToHHmm(hhmmss) {
            if(hhmmss === null) return null
            return hhmmss.substr(0,5)
        },
        ...mapActions('DefaultSetting', [
          'toggleDefaultSettingSelected',
          'postAttendanceFormatSave',
          'getAttendanceFormatSettingInfo',
          'postAttendanceFormat'
        ]),
         ...mapGetters('DefaultSetting', [
          'getDefaultSettingSelected',
          'getAttendanceFormatStartTime',
          'getAttendanceFormatEndTime',
          'getAttendanceFormatBreakTime'
        ])
    }
}
</script>