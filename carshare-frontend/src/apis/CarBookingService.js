import axios from 'axios'

import { BACKEND_URL } from '../Constants.js'


class CarBookingService {

    retrieveAvailableCars() {
        return axios.get(`${BACKEND_URL}/booking`)
    }

    retrieveAvailableChange(query){
        return axios.post(`${BACKEND_URL}/available-change`, query)
    }

    retrieveCarById(id){
        return axios.post(`${BACKEND_URL}/booking`,id)
    }

    getCurrentBooking(userId){
        return axios.post(`${BACKEND_URL}/currentBooking`,userId)
    }

    createBooking(data){
        return axios.post(`${BACKEND_URL}/create-booking`,data)
    }

    extendBooking(carId,bookingDateTime,endbookingTime,username,carRate,extendTime){
        return axios.post(`${BACKEND_URL}/extend-booking`,carId,bookingDateTime,endbookingTime,username,carRate,extendTime)
    }

    cancelBooking(bookingDateTime,price, carId,currDateTime, username){
        return axios.post(`${BACKEND_URL}/cancel-booking`,bookingDateTime, price, carId,currDateTime,username)
    }

    deleteBookingReceipt(){
        return axios.post(`${BACKEND_URL}/delete-booking`)
    }

    getBookingByBookingId(id){
        return axios.post(`${BACKEND_URL}/bookingId`,id)
    }

    retrieveBookingReceipt(id){
        return axios.post(`${BACKEND_URL}/booking-receipt`,id)
    }

    getBookingByCarId(carId,user,bookingTime){
        return axios.post(`${BACKEND_URL}/get-receipt`,carId, user, bookingTime)
    }

    retrieveAvailableParkingSpots(carId){
        return axios.post(`${BACKEND_URL}/get-parking`,carId)
    }

    returnCar(id, carId,bookingId,nowTime){
        return axios.post(`${BACKEND_URL}/return-car`, id, carId,bookingId, nowTime)
    }

    reportIssue(issue) {
        return axios.post(`${BACKEND_URL}/issue_report`, issue)
    }

    getUserIssues(username) {
        return axios.get(`${BACKEND_URL}/user-issues`, {params: {username: username}})
    }

    getIssueById(id){
        return axios.post(`${BACKEND_URL}/find-issue`, id)
    }

    retrieveAllIssues(){
        return axios.get(`${BACKEND_URL}/issues`)
    }

    refund(carId, issueId){
        return axios.post(`${BACKEND_URL}/refund`,carId, issueId)
    }

    changeCar(prevCarId, changeToCarId, issueId){
        return axios.post(`${BACKEND_URL}/change-car`, prevCarId, changeToCarId, issueId)
    }

} 

export default new CarBookingService();