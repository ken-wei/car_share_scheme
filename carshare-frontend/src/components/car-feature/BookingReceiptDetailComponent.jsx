import React, { Component } from "react";
import CarBookingService from "../../apis/CarBookingService";
import AuthenticationService from "../../apis/AuthenticationService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import '../../css/Booking.css'


class BookingReceiptDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carDetail: [],
            error: false,
            username: "",
            bookingDate:"",
            carID: "",
            booking: []
        }
        this.state.username = AuthenticationService.getCurrentUser()
        this.state.carID = this.props.location.carid
        this.state.bookingDate = this.props.location.bookingDate
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
        // this.retrieveCarInformation()
        this.retrieveBookingInformation()       
    }


    retrieveBookingInformation(){
        CarBookingService.getBookingByBookingId({id:this.props.location.state})
        .then(    
            response => {
                if (response.status === 200) {
                    this.setState({
                        booking : response.data,
                        carDetailLoaded: true
                    })
         
                    CarBookingService.retrieveCarById({id: this.state.booking.carId})
                    .then(
                        response => {
                            if (response.status === 200) {
                                this.setState({
                                    carDetail : response.data[0],
                                    bookingDetailLoaded: true,
                                    
                            })}
                        }
                    )
                }
            }      
        ).catch ( error => {
            this.setState({error: true});
        })
    }


    render(){

        return( 
            <div className="input-box" id="booking-receipt">
                <h4>Hi <span>{this.state.username}</span>! Thank you for booking.</h4>
                    { this.state.carDetailLoaded && this.state.bookingDetailLoaded 
                        ?
                            <>
                            <div className="receipt-details">
                                <p>BOOKING DATE</p><div>{this.state.booking.dateTime}</div>
                            </div>
                            <div className="receipt-details">
                                <p>END TIME</p><div>{this.state.booking.endBookingDateTime}</div>
                            </div>
                            <div className="receipt-car-details">
                                <div className="receipt-details car-details">
                                    <p>CAR ID</p><div>{this.state.carDetail.id}</div>
                                </div>
                                <div className="receipt-details car-details">
                                    <p>CAR TYPE</p><div>{this.state.carDetail.carType}</div>
                                </div>
                                <div className="receipt-details car-details">
                                    <p>FUEL TYPE</p><div>{this.state.carDetail.fuelType}</div>
                                </div>
                                <div className="receipt-details car-details">
                                    <p>CAR MODEL</p><div>{this.state.carDetail.model}</div>
                                </div>
                                <div className="receipt-details car-details">
                                    <p>CAR NAME</p><div>{this.state.carDetail.name}</div>
                                </div>
                            </div>
                            
                            <div className="receipt-details">
                                <p>OVERTIME</p><div>{this.state.booking.overTime ? "Yes" : "No"}</div>
                            </div>
                            <div className="receipt-details">
                                <p>RETURNED</p><div>{this.state.booking.returned ? "Yes" : "No"}</div>
                            </div>

                            <div className="receipt-price-details receipt-car-details">
                                <div className="receipt-details booking-receipt-duration">
                                    <p>DURATION</p><div>{this.state.booking.duration} Hours</div>
                                </div>
                                <div className="receipt-details booking-receipt-price">
                                    <p>TOTAL PRICE</p><div>$ {this.state.booking.price}</div>
                                </div>
                            </div>
                            </>
                        :
                            <FontAwesomeIcon className="loading-icon" icon={faCircleNotch} spin size="5x"/> 
                    }
                    
                    
            </div>

        )
    }

}export default BookingReceiptDetailComponent;
