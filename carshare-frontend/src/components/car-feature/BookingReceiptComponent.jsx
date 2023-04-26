import React, { Component } from "react";
import CarBookingService from "../../apis/CarBookingService";
import AuthenticationService from "../../apis/AuthenticationService";
import {Button } from 'react-bootstrap';
import '../../css/Booking.css'
import moment from "moment";
import MaterialTable, { MTableToolbar }  from 'material-table';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import InputIcon from '@material-ui/icons/Input';
import AssignmentReturnRoundedIcon from '@material-ui/icons/AssignmentReturnRounded';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import AddBoxIcon from '@material-ui/icons/AddBox';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    InputIcon: forwardRef((props, ref) => <InputIcon style={{color: 'rgb(66, 162, 226)'}}{...props} ref={ref} />),
    AssignmentReturnRoundedIcon: forwardRef((props, ref) => <AssignmentReturnRoundedIcon style={{color: '#e91219'}} {...props} ref={ref} />),
    CancelSharpIcon: forwardRef((props, ref) => <CancelSharpIcon style={{color: '#e91219'}} {...props} ref={ref} />),
    AddBoxIcon: forwardRef((props, ref) => <AddBoxIcon style={{color: 'rgb(19, 212, 29)'}} {...props} ref={ref} />)
};

class BookingReceiptComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credit: 0,
            carDetail: [],
            error: false,
            username: "",
            bookingId: "",
            length:0,
            current: [],
            upcomings: [],
            pastHistory:[],
            tempUpcomings:[],
            tempPastHistory:[],
            tempCurrent: [],
            extendTime: 0,
            curBookingSelected: true,
         
        }
        this.state.username = AuthenticationService.getCurrentUser()
        this.retrieveBookingReceipt = this.retrieveBookingReceipt.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.getCredit = this.getCredit.bind(this)
    }

    componentDidMount() {
        this.getCredit()
        this.retrieveBookingReceipt()
    }

    getCredit(){
        AuthenticationService.getCredit({username: AuthenticationService.getCurrentUser()})
        .then(
            response => {
                if (response.status ===200){
                    this.setState({
                        credit : response.data.credit
                    })
                }
            }
        )
        
    }

    getCurrentDate(separator='-') {
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let hour = newDate.getHours();
        let mins = newDate.getMinutes();
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}T${hour}:${mins}`
    }

    retrieveBookingReceipt(){
        CarBookingService.retrieveBookingReceipt({userid:this.state.username})
        .then(
            response=>{
                if (response.status === 200 ) {
                    var currTime = moment(this.getCurrentDate(), 'YYYY-MM-DDTHH:mm');
                    for (var i=0;i<response.data.length;i++){
                        var endBookingTime = moment(response.data[i].endBookingDateTime,'YYYY-MM-DDTHH:mm')
                        var returned = response.data[i].returned
                        console.log(response.data)
                        // To check whether the booking is returned and set the value
                        if (response.data[i].returned === false){
                            if (endBookingTime.isBefore(currTime) && response.data[i].overTime === false){
                                AuthenticationService.reduceCredit({username:AuthenticationService.getCurrentUser(), bookingId: response.data[i].id})
                            }
                        }
                        if( response.data[i].returned === false){
                            this.state.tempCurrent.push(response.data[i])
                        }
                        else if(currTime.isAfter(endBookingTime) && returned === true){
                            this.state.tempPastHistory.push(response.data[i])
                        }
                    }   
                    const Moment = require('moment')  
                    
                    const sortedArray  = this.state.tempCurrent.sort((a,b) => new Moment(a.dateTime).format('YYYYMMDDHHmm') - new Moment(b.dateTime).format('YYYYMMDDHHmm'))
                    this.setState({ 
                        upcomings: this.state.tempUpcomings,
                        pastHistory: this.state.tempPastHistory,
                        current: sortedArray
                    })
                }
            }
        ).catch( error =>{
            this.setState({error: "true"});
        }

        )
    }


    check = e => {
        this.props.history.push('/booking-detail', e.target.value)
    }

    // Cancel api call using axios
    cancelBooking(bookingDateTime,price,carId){
        CarBookingService.cancelBooking({bookingDateTime: bookingDateTime, price: price,carId: carId, currDateTime: this.getCurrentDate(), username: this.state.username})
        .then(
            response => {
                if (response.status === 200) {
                    this.props.history.push('/home')
                }
            }
        )
    }

    // Get all available parking spots and push to return page
    getAvailableParkingSpots(carId,bookId){
        CarBookingService.retrieveAvailableParkingSpots({carId: carId})
        .then(
            response => {
                if (response.status === 200) {
                    this.props.history.push('/return-car', [response.data, carId, bookId])
                }
            }
        )
    }

    book = e =>{
        this.props.history.push('/extend',e.target.value)
    }

    // Update the bool for selected tab
    updateCurrSelectedTab = () => {
        this.setState({curBookingSelected: true})
    }

    // Update the bool for selected tab
    updateHistorySelectedTab = () => {
        this.setState({curBookingSelected: false})
    }

    // Goes to show details pages
    showDetails = e => {
        this.props.history.push('/booking-detail', e)
    }

    // Extend booking page
    extendBooking = e => {
        this.props.history.push('/extend', e)
    }

    
    
    render(){
       let now = moment().format('YYYY-MM-DDTHH:mm')
       
        const cansave = (dateTime) =>{
            const newdateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm');
            // console.log(newdateTime)
            // console.log(newdateTime.isBefore(now))
            return (newdateTime.isBefore(now))
        }
       
        return(
            <div className="my-booking-page">
                <MaterialTable
                            icons={tableIcons}
                            title="My Bookings"
                            columns={[
                                { title: 'Booking ID', field: 'id', 
                                    cellStyle: {
                                        fontWeight: '600'
                                    },
                                    headerStyle: {
                                        backgroundColor: 'rgb(145 195 234)',
                                    }
                                },
                                { title: 'Car ID', field: 'carId' },
                                { title: 'Start Time', field: 'dateTime' },
                                { title: 'End Time', field: 'endBookingDateTime',}
                            ]}
                            actions={ this.state.curBookingSelected 
                                            ?
                                                [
                                                    {
                                                        icon: tableIcons.InputIcon,
                                                        tooltip: 'Show Details',
                                                        onClick: (event, rowData) => this.showDetails(rowData.id)
                                                    },
                                                    {
                                                        icon: tableIcons.AddBoxIcon,
                                                        tooltip: 'Extend Booking',
                                                        onClick: (event, rowData) => this.extendBooking(rowData.id)
                                                    },
                                                    {
                                                        icon: tableIcons.AssignmentReturnRoundedIcon,
                                                        tooltip: 'Return Car',
                                                        onClick: (event, rowData) => this.getAvailableParkingSpots(rowData.carId, rowData.id)
                                                    },

                                                    rowData => ({
                                                        icon: tableIcons.CancelSharpIcon,
                                                        tooltip: 'Cancel Booking',
                                                        disabled: cansave(rowData.dateTime),
                                                        onClick: (event, rowData) => this.cancelBooking(rowData.dateTime, rowData.price, rowData.carId)
                                                    }),
                                                ]
                                            :
                                                [
                                                    {
                                                        icon: tableIcons.InputIcon,
                                                        tooltip: 'Show Details',
                                                        onClick: (event, rowData) => this.showDetails(rowData.id)
                                                    }
                                                ]
                            }
                            options={{
                                actionsColumnIndex: -1,
                                sorting: true,
                                headerStyle: {
                                    backgroundColor: 'lightblue',
                                    color: 'black',
                                    fontWeight: 600, 
                                },
                                rowStyle: rowData => ({
                                    backgroundColor: (this.state.userListSelectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                                })
                            }}
                            data={this.state.curBookingSelected ? this.state.current : this.state.tempPastHistory}
                            components={{
                                Toolbar: props => (
                                  <div>
                                    <MTableToolbar {...props} />
                                    <div style={{padding: '0px 10px'}}>
                                        <Button className="home-car-table-distance-button current-booking-button" onClick={this.updateCurrSelectedTab}>Current Booking</Button>
                                        <Button className="home-car-table-distance-button history-booking-button" onClick={this.updateHistorySelectedTab}>Booking History</Button>
                                    </div>
                                    <div className="credit-score">Credit Score: {this.state.credit}</div>
                                  </div>
                                ),
                              }}
                />

            </div>
        )
    }



}export default BookingReceiptComponent;