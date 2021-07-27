<template>
    <v-layout>
        <v-row class="mt-5 ml-5">
            <v-col>
                <v-btn @click="apiTest()">api test</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                {{ test }}
            </v-col>
        </v-row>
    </v-layout>
</template>

<script>
import axios from 'axios'
const api = axios.create({withCredentials: true, baseURL: 'http://localhost:8080'})
// api.defaults.baseURL = 'http://localhost:8080'

export default {
    data() {
        return {
            test: 'test'
        }
    },
    methods: {
        apiTest() {
            api.get("/test")
            .then(response => {
                console.log('success')
                console.log(response)
                this.test = response.data
            })
            .catch(error => {
                console.log('faild')
                console.log(error)
            })
        }
    }
}
</script>