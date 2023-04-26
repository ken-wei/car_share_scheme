import React, { Component } from "react";
import CarBookingService from "../../apis/CarBookingService";
import {Table, Button} from 'react-bootstrap';
import '../../css/Booking.css'
import AuthenticationService from "../../apis/AuthenticationService";
import WalletService from "../../apis/WalletService";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

class CreateBookingComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carDetail: [],
            error: false,
            quantity: 0,
            totalPrice: 0,
            max: 24,
            min: 0,
            username: "",
            balance: 0,
            errorMessage:"",
            bookingDateTime:"",
            endBookingDateTime:"",
            returned:false

        }
        this.state.username = AuthenticationService.getCurrentUser()
        this.componentDidMount = this.componentDidMount.bind(this);        
    }

    componentDidMount(){
        this.retrieveCarInformation()
        this.getBalance()
        this.getCurrentDate()
    }

    handleInputDateTime = event => 
    {
        this.setState( {bookingDateTime: event.target.value} )
       
    }
    getCurrentDate(separator='-'){

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let hour = newDate.getHours();
        let mins = newDate.getMinutes();
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}T${hour}:${mins}`
        }

    // Function to increment the count for Hours form selection
    increment = () => {
        this.setState(prevState => {
            if(prevState.quantity < 9) {
                return {
                    quantity: prevState.quantity + 1
                }
            }
        });
    }

    // Function to decrement the count for Hours form selection
    decrement = () => {
      this.setState(prevState => {
        if(prevState.quantity > 0) {
            return {
                quantity: prevState.quantity - 1
            }
        }
      });
    }

    // Get user's balance and set it to the state
    getBalance(){
        WalletService.retrieveBalance(AuthenticationService.getCurrentUser())
            .then(
                response => {
                    // console.log(response.data['balance'])
                    this.setState({ balance: response.data['balance'] })
                }
            )
    }

    // Retrieve the car information using the props state car id
    retrieveCarInformation(){
        // console.log(this.props.location.state)
        CarBookingService.retrieveCarById({id: this.props.location.state})
        .then(    
            response => {
                if (response.status === 200) {
                    this.setState({
                        carDetail : response.data[0],
                        carDetailLoaded: true
                    })
                }
            }      
        ).catch ( error => {
            this.setState({error: true});
        })
    }

    // Create booking function when user clicked on Confirm Booking
    createBooking(){
        var bookingDateTime1 = moment(this.state.bookingDateTime,'YYYY-MM-DDTHH:mm')
        var endBookingDateTime = moment(bookingDateTime1).add(this.state.quantity, 'hours').format('YYYY-MM-DDTHH:mm');

        if (this.state.bookingDateTime === "" || this.state.quantity === 0) {
            this.setState({error: "true", errorMessage: "Error input! Enter a valid hour quantity and booking date time."})
            return;
        } else {
            CarBookingService.createBooking({userId:this.state.username, carId: this.state.carDetail.id, duration: this.state.quantity, price: this.state.quantity*this.state.carDetail.rate, dateTime: this.state.bookingDateTime, endBookingDateTime: endBookingDateTime, returned:this.state.returned, overTime:false})
            .then(    
                    response => {
                        if (response.status === 200) {
                            this.props.history.push('/home'); 
                        }
                        else if (response.status === 203){      
                            this.setState({error: "true", errorMessage: response.data['error']});
                        }
                    }      
                ).catch ( error => {
                    this.setState({error: "true"});
            })
        }
        
    }

    render(){
        // console.log(this.state.balance)
        return(
         
            <div className = "container">
                <div className = "create-booking-content input-box">
                     { this.state.error === "true" ? <li className="form-error-msg">{this.state.errorMessage}</li> : <div></div>}
                        <h3>Booking Details</h3>
                        { this.state.carDetailLoaded 
                            ?
                                <>
                                    <Table>
                                        <tbody>
                                            <tr>
                                            <th>ID</th>
                                            <td>{this.state.carDetail.id}</td>
                                            </tr>
                                            <tr>
                                                <th>Name</th>
                                                <td>{this.state.carDetail.name} the {this.state.carDetail.model}</td>
                                            </tr>
                                            <tr>
                                                <th>Type</th>
                                                <td>{this.state.carDetail.carType}</td>
                                            </tr>
                                            <tr>
                                                <th>Fuel Type</th>
                                                <td>{this.state.carDetail.fuelType}</td>
                                            </tr>
                                            <tr>
                                                <th>Rate</th>
                                                <td>$ {this.state.carDetail.rate} / hour</td>
                                            </tr>
                                            <tr>
                                                <th>Date Time</th>
                                                <td><input type="datetime-local" min={moment().format('YYYY-MM-DDTHH:mm')} onChange={e => this.handleInputDateTime(e)} /></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <h5>Booking Hours</h5>
                                    <Button variant="danger" className="decrement" onClick = {this.decrement}>-</Button>
                                    <input className="price-input-field" value={this.state.quantity} onChange={this.handleChange} disabled/>
                                    <Button variant="danger" className="increment" onClick={this.increment}>+</Button>
                                    <div>
                                        <h5 className="booking-price">Total Price : $ {this.state.quantity*this.state.carDetail.rate}</h5>
                                        <Button variant="success" className = "confirm-booking-btn myButton" onClick={()=>this.createBooking()}>Confirm Booking</Button>
                                    </div>
                                </>
                            :
                                <FontAwesomeIcon className="loading-icon" icon={faCircleNotch} spin size="5x"/> 
                        }  
                </div>
            </div>       
        )
    }
}
export default CreateBookingComponent;