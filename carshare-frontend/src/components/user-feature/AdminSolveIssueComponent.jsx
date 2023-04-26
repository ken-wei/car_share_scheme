import React, { Component } from 'react'
import {Table, Button} from 'react-bootstrap';
import CarBookingService from '../../apis/CarBookingService';
import "../../css/AdminPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

class AdminSolveIssueComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id : '',
            issue: [],
            refund: true,
            booking: [],
            availableForChange: [],
            carChange: '',
            issueLoaded: false,
            bookingLoaded: false,
            carAvailableLoaded: false,
        }        
    }

    componentDidMount(){
        this.setState({
            id: this.props.location.state
        })
        this.retrieveIssue()

        
    }

    // Retrieve the issue using the id retrieve back admin management page
    retrieveIssue(){
        CarBookingService.getIssueById({id: this.props.location.state})
        .then(
            (response) => { 
                if (response.status === 200 ) {
                    this.setState({issue: response.data, issueLoaded: true})
                    this.retrieveBooking(response.data.bookingId)
                }
            }).catch( error =>{
                // Error Handling
            }
        )
    }

    // retrieve the booking using the id inside issue's entity
    retrieveBooking(carId){
        CarBookingService.getBookingByBookingId({id: carId}).then(
            (response) => { 
                if (response.status === 200 ) {
                    this.setState({booking: response.data, bookingLoaded: true})
                    this.retrieveAvailableChange(response.data.price,response.data.duration)
                }
            }).catch( error =>{
                // Error Handling
            }
        )
    }

    retrieveAvailableChange(price, duration){
        CarBookingService.retrieveAvailableChange({query:{'price':price, 'duration':duration}}).then(
            (response) =>{
                if(response.status === 200) {
                    this.setState({availableForChange: response.data, carAvailableLoaded: true})
                }
            }).catch( error => {

            }
        )
    }

    refund(){
        CarBookingService.refund({'carId': this.state.booking.carId, 'issueId': this.state.id}).then(
            (response) => {
                if(response.status === 200){
                    this.props.history.push('/adminpage')
                }
            }).catch( error => {

            }
        )

    }

    changeCar(){
        CarBookingService.changeCar({'prevCarId': this.state.booking.carId, 'changeToCarId': this.state.carChange, 'issueId':this.state.id}).then(
            (response) => {
                if(response.status === 200){
                    this.props.history.push('/adminpage')
                }
            }).catch( error => {

            }
        )
    }

    handleChange = e => {
        if(e.target.value==="Refund"){this.setState({refund: true})}
        else{this.setState({refund:false})}
    }

    handleCarChange = e =>{
        this.setState({carChange: e.target.value})
    }

    render() {
        return(
            <div className="issue-details-page">
                <div className="issue-title">
                    <h2> Issue <span># {this.state.id}</span> </h2>
                </div>
                {this.state.issueLoaded ? 
                    <>
                        <Table responsive>
                            <tbody> 
                                <tr>
                                    <th>Booking ID</th>
                                    <td>{this.state.issue['bookingId']}</td>
                                </tr>
                                <tr>
                                    <th>Car ID</th>
                                    <td>{this.state.issue['carId']}</td>
                                    
                                    {/* <th></th> */}
                                </tr> 
                                
                                <tr>
                                    <th>Title</th>
                                    <td>{this.state.issue['title']}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{this.state.issue['description']}</td>
                                </tr>
                            </tbody>
                        </Table>
                        
                        <div>
                            <h2>Status / Action</h2>
                            {!this.state.issue.solved
                                ?
                                    <div>
                                    <select className="select-option" onChange={this.handleChange}>
                                            <option>Refund</option>
                                            <option>Change Booking</option>
                                    </select>
                                    <br></br><br></br></div>
                                :
                                    <br/>
                            }
                            
                            <Table>
                            {
                                this.state.issue.solved
                                    ?   
                                        // Issues Solved 
                                        <tbody>
                                            <tr>
                                                <th>{this.state.issue.solved ? <span className="solved-text">SOLVED </span> : <span className="unsolved-text">UNSOLVED</span>}</th>
                                            </tr>
                                            <tr>
                                                <th>{this.state.issue.comment}</th>
                                            </tr>
                                        </tbody>
                                    :   
                                        // Issues Unsolved
                                        this.state.refund
                                        ?
                                            <>
                                                {/* Refund Option */}
                                                <tbody>
                                                    <tr>
                                                        <th>{this.state.issue.solved ? <span className="solved-text">SOLVED </span> : <span className="unsolved-text">UNSOLVED</span>}</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Amount to be Refunded to {this.state.issue['username']} - AU {this.state.booking['price']}.00</th>
                                                    </tr>
                                                    <tr>
                                                        <th>        
                                                            <Button className="refund-button" variant="success" onClick={()=>this.refund()}> Refund (AU {this.state.booking['price']}.00) </Button>
                                                        </th>
                                                    </tr>
                                                </tbody>

                                            </>
                                        :
                                    
                                            <>  
                                                {/* Change Booking Option */}
                                                <tbody>
                                                    <tr>
                                                        <th><h4>Current Booking Details</h4></th>
                                                    </tr>
                                                    <tr>
                                                        <th>CarID - {this.state.issue['carId']}</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Duration - {this.state.booking['duration']}</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Price - $ {this.state.booking['price']}</th>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            <h4>Change Car Booking To</h4>
                                                            <select className="select-option " onChange={this.handleCarChange}>
                                                                <option value="" disabled selected>Select your option</option>
                                                                {this.state.availableForChange.map(car =>
                                                                    <option key={car.id} value={car.id}>({car.id}) {car.name} The {car.model}</option>
                                                                )}
                                                            </select>
                                                            <div>
                                                                <Button className="refund-button" variant="success" onClick={()=>this.changeCar()}>Update Car Booking</Button>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </tbody>  
                                            </>
                                    }

                            </Table>    
                        </div>
                    </>
                  : 
                    <FontAwesomeIcon icon={faCircleNotch} spin size="5x"/> 
                }
                

                
            </div>
        )
    }
}

export default AdminSolveIssueComponent;