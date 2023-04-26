import React, { Component } from "react";
import CarBookingService from "../../apis/CarBookingService";
import {Table, Button} from 'react-bootstrap';
import '../../css/Booking.css'
import AuthenticationService from "../../apis/AuthenticationService";
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
            returned:false,
            booking:[],
            total:0,
            extendTime:0

        }
        this.state.username = AuthenticationService.getCurrentUser()
        this.componentDidMount = this.componentDidMount.bind(this);    
    }

    componentDidMount(){
        this.getBooking()
    }

    handleInputDateTime = event => 
    {
        this.setState( {bookingDateTime: event.target.value} )
       
    }
    
    // Get the booking details and car details 
    getBooking(){
        CarBookingService.getBookingByBookingId({id:this.props.location.state})
        .then(
            response =>{
                if (response.status === 200){
                    this.setState({
                        booking : response.data,
                        bookingDetailLoaded: true
                    })
                    console.log(this.state.booking)
                    CarBookingService.retrieveCarById({id: this.state.booking.carId})
                    .then(    
                        response => {
                            if (response.status === 200) {
                                this.setState({
                                    carDetail : response.data[0],
                                    carDetailLoaded: true
                                })
                                console.log(this.state)
                            }
                        }      
                    ).catch ( error => {
                        // console.log("error true")
                        this.setState({error: true});
                    })

                }
            }
        )
    }


    // Extension hours increment
    increment = () => {
        this.setState(prevState => {
            if(prevState.quantity < 9) {
                return {
                    quantity: prevState.quantity + 1
                }
            }
        });
    }

    // Extension hours decrement
    decrement = () => {
      this.setState(prevState => {
        if(prevState.quantity > 0) {
            return {
                quantity: prevState.quantity - 1
            }
        }
      });
    }

    // API call to Booking API using axios to extends the booking time for the current selected booking
    extendBooking2(bookingDateTime,endbookingTime,carId){
        var total = this.state.quantity * this.state.carDetail.rate
        if (this.state.quantity === 0){
            this.setState({error: "true", errorMessage: "Error input! Enter a valid hour quantity."})
            return;
        }else{
            CarBookingService.extendBooking({carId:carId,bookingDateTime: bookingDateTime,endbookingTime: endbookingTime, username: this.state.username, carRate: total, extendTime: this.state.quantity})
            .then(
                response => {
                    if (response.status === 200) {
                        this.props.history.push('/home')
                    }else{
                        this.setState({error:"true", errorMessage: response.data.error} )

                    }
                }
            ).catch (error => {
                this.setState({error :true})
            })
        }
                  
    }


    render(){
        return(
            <div className = "container">
                <div className = "create-booking-content input-box">
                     { this.state.error === "true" ? <li className="form-error-msg">{this.state.errorMessage}</li> : <div></div>}
                        <h3>Booking Details</h3>
                        { this.state.carDetailLoaded && this.state.bookingDetailLoaded
                            ?
                                <>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <th>Booked Time</th>
                                                <td>{this.state.booking.dateTime}</td>
                                            </tr>
                                            <tr>
                                                <th>Car ID</th>
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
                                                <th>Rate</th>
                                                <td>$ {this.state.carDetail.rate} / hour</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <h5>Extend Booking Hours</h5>
                                    <Button variant="danger" className="decrement" onClick = {this.decrement}>-</Button>
                                    <input className="price-input-field" value={this.state.quantity} onChange={this.handleChange} disabled/>
                                    <Button variant="danger" className="increment" onClick={this.increment}>+</Button>
                                    <div>
                                        <h5 className="booking-price">Total Price : $ {this.state.quantity*this.state.carDetail.rate}</h5>
                                        <Button variant="success" className = "confirm-booking-btn myButton" onClick={()=>this.extendBooking2(this.state.booking.dateTime,this.state.booking.endBookingDateTime,this.state.carDetail.id)}>Confirm Extension</Button>
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