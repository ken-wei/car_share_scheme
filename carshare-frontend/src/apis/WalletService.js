import axios from 'axios'
import '../Constants.js'
import { BACKEND_URL } from '../Constants.js'

class WalletService{
    retrieveBalance(username){
        return axios.get(`${BACKEND_URL}/balance`, {params: {id: username}})
    }

    updateBalance(username, balance) {
        return axios.post(`${BACKEND_URL}/updatebalance`, {params: {id: username, amount: balance}})
    }

}

export default new WalletService()