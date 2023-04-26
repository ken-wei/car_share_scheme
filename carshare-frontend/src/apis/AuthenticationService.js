import axios from 'axios'
import { BACKEND_URL } from '../Constants.js'

class AuthenticationService {

    authenticate(userInfo) {
        return axios.post(`${BACKEND_URL}/login`, userInfo)
    }

    registerSuccessfulLogin(username) {
        sessionStorage.setItem("current_user", username)
    }

    forgotPassword(username,password){
        return axios.post(`${BACKEND_URL}/forgot-password`,username,password)
    }

    reduceCredit(username,bookingId){
        return axios.post(`${BACKEND_URL}/reduce-credit`,username,bookingId)
    }

    getCredit(username){
        return axios.post(`${BACKEND_URL}/credit`,username)
    }

    getUsers(username){
        return axios.post(`${BACKEND_URL}/find-password`,username)
    }

    getAllUsers() {
        return axios.get(`${BACKEND_URL}/allusers`)
    }

    getCurrentUser() {
        return sessionStorage.getItem("current_user")
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem("current_user")
        if (user === null) return false
        return true
    }

    logout() {
        sessionStorage.removeItem("current_user")
        sessionStorage.removeItem("current_user_admin")
    }

    isAdmin(isAdmin) {
        sessionStorage.setItem("current_user_admin", isAdmin)
        
    }

    isTheCurrentUserAdmin() {
        let isAdmin = sessionStorage.getItem("current_user_admin")
        if (isAdmin === null) return false
        if (isAdmin === "admin") {
            return true
        }
        return false
    }

} 

export default new AuthenticationService();