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
        <v-row>
            <v-col>
                <v-time-picker></v-time-picker>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
              <!-- カード内にフローティングアクションボタンを配置します。 -->
              <v-card>
                <v-card-title>タイトル</v-card-title>
                <!-- テキストを表示するためのv-card-text -->
                <v-card-text style="height: 200px;">本文</v-card-text>
                <!-- フローティングアクションボタンを配置するためのv-card-text -->
                <v-card-text style="height: 50px; position: relative">
                  <!--
                    フローティングアクションボタンを定義します。
                    fab:丸いボタンにします。
                    absolute/top/right:コンポーネントの指定位置に表示します。
                  -->
                  <v-btn
                    fab
                    absolute
                    top
                    right
                    color="primary"
                  >
                    <!-- プラスのアイコンにします。 -->
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
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