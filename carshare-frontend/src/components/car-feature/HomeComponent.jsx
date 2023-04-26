import React, { Component } from "react";
import CarBookingService from "../../apis/CarBookingService";
import {Button} from 'react-bootstrap';
import MapComponent from "./MapComponent";
import { getDistance } from 'geolib';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import MaterialTable, { MTableToolbar } from 'material-table';
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
import BookIcon from '@material-ui/icons/Book';

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
    InputIcon: forwardRef((props, ref) => <InputIcon {...props} ref={ref} />),
    BookIcon: forwardRef((props, ref) => <BookIcon className="home-car-book-icon" {...props} ref={ref} />)
  };

// const geolib = require('geolib');

class HomeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data : [],
            displayClosest: false,
            distanceCalculated: false
        }
    }
    
    componentDidMount(){
        console.log('componentDidMount')
        this.getUserLocation()
        this.retrieveAvailableCars()
    }

    getUserLocation = () => {
        var pos = {}
        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
            navigator.geolocation.getCurrentPosition( 
                (position) => {
                    pos = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    this.setState({userPosition: pos})
                    // console.log("OK")
                },)
            
        } else {
            // Else conditions
        }
        return pos
    }

    retrieveAvailableCars(){
        CarBookingService.retrieveAvailableCars()
            .then(
                response => {
                    this.setState({ data: response.data })
                }
            )
    }

    book = e =>{
        this.props.history.push('/book',e.target.value)
    }

    bookingRedirect = e  => {
        this.props.history.push('/book',e)
    }

    updateDisplayClosest = () => {
        // Update the state when user clicked on the button
        if (this.state.userPosition) {
            this.setState({displayClosest: !this.state.displayClosest})
            this.updateCarDistance()
        }
    }

    updateCarDistance = () => {
        if (this.state.userPosition) {
            console.log("testing inside car distance")
            var copyOfCurrentState = this.state.data.slice()
            copyOfCurrentState.forEach((car) => {
                car.distance = getDistance(this.state.userPosition, {
                    latitude: car["parking-detail"][0].lat,
                    longitude: car["parking-detail"][0].lng,
                }); // eslint-disable-next-line
            })
            this.setState({data: copyOfCurrentState, distanceCalculated: true})
            console.log(this.state)
        }
        
    }


    render () {

        return (
            <div id="homepage-container">
                <MapComponent/>
                <div className="home-booking-table">
                    <MaterialTable
                        localization={{
                            header: {
                                actions: 'Book'
                            },
                        }}
                        icons={tableIcons}
                        style={{width: "90%"}}
                        title={"Available Cars"}
                        columns={ this.state.userPosition && this.state.displayClosest
                            ? 
                                [
                                    { title: 'Car ID', field: 'id',
                                    cellStyle: {
                                        fontWeight: 700
                                    } },
                                    { title: 'Car Name', field: 'name', },
                                    { title: 'Model', field: 'model' },
                                    { title: 'Size', field: 'carType'},
                                    { title: 'Price/hr', field: 'rate' },
                                    { title: 'Availability', render: rowData => <FontAwesomeIcon style={{ color: 'green'}} icon={faCheck} size="lg"/> },
                                    { title: 'Distance/metres', field: 'distance' }
                                ]
                            :
                                [
                                    { title: 'Car ID', field: 'id',cellStyle: {
                                        fontWeight: 700
                                    } },
                                    { title: 'Car Name', field: 'name', },
                                    { title: 'Model', field: 'model' },
                                    { title: 'Size', field: 'carType'},
                                    { title: 'Price/hr', field: 'rate' },
                                    { title: 'Availability', render: rowData => <FontAwesomeIcon style={{ color: 'green'}} icon={faCheck} size="lg"/> },
                                ]
                        }
                        
                        data={this.state.data}       
                        actions={[
                            {
                            icon: tableIcons.BookIcon,
                            tooltip: 'Book this car',
                            onClick: (event, rowData) => this.bookingRedirect(rowData.id)
                            }
                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            sorting: true,
                            search: true,
                            headerStyle: {
                                backgroundColor: 'lightblue',
                                color: 'black',
                                fontWeight: 600, 
                            },
                            rowStyle: rowData => ({
                                backgroundColor: (this.state.userListSelectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                            })
                        }}
                        components={{
                            Toolbar: props => (
                              <div>
                                <MTableToolbar {...props} />
                                <div style={{padding: '0px 10px'}}>
                                    <Button className="home-car-table-distance-button" 
                                            style={{width: '20%'}} onClick={this.updateDisplayClosest} disabled={!this.state.userPosition}>
                                            {this.state.userPosition ?  this.state.displayClosest ? "Back to Default" : "Update Distance" : "Location disabled" }
                                           
                                    </Button>
                                </div>
                              </div>
                            ),
                          }}
                    />
                </div>
                {/* <h2>Available Cars: </h2>
                <Table responsive>
                    <tbody>
                    
                        <tr>
                            <th>Car</th>
                            <th></th>
                            <th colSpan="2"><Button style={{width: '100%'}} onClick={this.updateDisplayClosest} >{this.state.displayClosest ? "Closest Cars" : "Default"}</Button></th>
                        </tr> 
                    
                    {   
                        !this.state.displayClosest 
                        
                        ?
                            this.state.data.map(
                                car =>
                                    <tr key={car.id}>
                                        <td>[{car.id}] {car.name} the {car.model}</td>
                                        <td> Rate: {car.rate} / hour</td>
                                        <td><Button value = {car.id} onClick={this.book}>Book</Button></td>
                                    </tr>
                            )
                        :
                            this.state.data.sort((car1, car2) => (car1.distance - car2.distance))
                                .map(
                                    car =>
                                        <tr key={car.id}>
                                            <td>[{car.id}] {car.name} the {car.model}</td>
                                            <td> Rate: {car.rate} / hour</td>
                                            <td> Distance: {car.distance} metres</td>
                                            <td><Button value = {car.id} onClick={this.book}>Book</Button></td>
                                        </tr>
                                )
                    }   
                    </tbody>
                
                </Table> */}
                
            </div>
            
        )
    }

}

export default HomeComponent;