import axios from 'axios'
import { BACKEND_URL } from '../Constants.js'


class RegistrationService {

    registerAccount(userInfo) {
        return axios.post(`${BACKEND_URL}/signup`, userInfo)
    }

} 

export default new RegistrationService();