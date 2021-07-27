import axios from 'axios'
const api = axios.create({withCredentials: true})
api.defaults.baseURL = 'http://localhost:8080'



export const state = () => ({
    userBasicInfo: {
        userId: '',
        userLastName: '',
        userLastNameReading: '',
        userFirstName: '',
        userFirstNameReading: '',
        birthday: new Date(),
        age: 0,
        postalCode: 0,
        address: '',
        email: '',
        roleType: ''
    }
})

export const mutations = {
    setUserBasicInfoByEmail(state, payload) {
        state.userBasicInfo.userId = payload.user_id
        state.userBasicInfo.userLastName = payload.user_last_name
        state.userBasicInfo.userLastNameReading = payload.user_last_name_reading
        state.userBasicInfo.userFirstName = payload.user_first_name
        state.userBasicInfo.userFirstNameReading = payload.user_first_name_reading
        state.userBasicInfo.birthday = payload.birthday
        state.userBasicInfo.age = payload.age
        state.userBasicInfo.postalCode = payload.postal_code
        state.userBasicInfo.address = payload.address
        state.userBasicInfo.email = payload.email
        state.userBasicInfo.roleType = payload.role_type
    }
}

export const actions = {
    async setUserBasicInfoByEmail({commit}, email) {
        await api.get('/user/basicInfo', { params: {email: email} })
        .then(response => {
            commit('setUserBasicInfoByEmail', response.data)
        })
        .catch(error => {
            console.log(`error UserInfo/setUserBasicInfoByEmail : ${error}`)
        })
    }
}