<template>
    <v-layout>
        <v-row class="mb-16" align-content="center" justify="center">
            <v-col cols="7">
                <v-card color="grey lighten-4">        
                    <v-card-title>Login</v-card-title>
                    <v-row justify="center">
                        <v-col cols="11">
                            <v-text-field v-model="loginInfo.email" @input="updateUserInfo()" label="Email"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="11">
                            <v-text-field v-model="loginInfo.pass" @input="updateUserInfo()" label="Password"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col class="mb-2" cols="11">
                            <v-btn color="primary" @click="submit()">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-layout>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'

export default {
    data() {
        return {
            loginInfo: {
                email: '',
                pass: ''
            }
        }
    },
    methods: {
        updateUserInfo() {
            this.$store.commit('LoginInfo/updateUserInfo', this.loginInfo)
        },
        submit() {
            var params = new URLSearchParams()
            params.append('email', this.loginInfo.email)
            params.append('pass', this.loginInfo.pass)
            api.post("/login", params)
            .then(response => {
                this.$router.push('/attendance')
            })
            .catch(error => {
                console.log('faild')
                console.log(error)
            })
        }
    }
}
</script>