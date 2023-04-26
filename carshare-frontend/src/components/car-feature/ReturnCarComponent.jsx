import React from "react"
import CarBookingService from '../../apis/CarBookingService'
import '../../css/Wallet.css'
import '../../css/Booking.css'
// import {Table, Form, Button} from 'react-bootstrap';
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faParking } from '@fortawesome/free-solid-svg-icons'
import MaterialTable from 'material-table';
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
    AssignmentReturnRoundedIcon: forwardRef((props, ref) => <AssignmentReturnRoundedIcon style={{color: '#e91219'}} {...props} ref={ref} />)
  };

class ReturnCarComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            parkingId: '',
            bookId:''
        }
        this.componentDidMount = this.componentDidMount.bind(this);        
    }

    componentDidMount(){
        console.log(this.props)
        // console.log(this.props.location.state[2])
    }

    // Return the car back to the parking spot that has been chosen
    returnCar(parkingId){
        var bookingId = this.props.location.state[2]
        var carId = this.props.location.state[1]
        var nowtime = moment().format('YYYY-MM-DDTHH:mm')
        console.log(nowtime);
        CarBookingService.returnCar({id: parkingId ,carId: carId,bookingId: bookingId,nowTime: nowtime})
        .then(
            response => {
                if (response.status === 200) {
                    // console.log(response.data)
                    this.props.history.push('/home')
                }
            }
        )
    }

    render(){
        return(
            <div className="return-car-component">

                        <MaterialTable
                            icons={tableIcons}
                            title="Available Parking Spots"
                            columns={[
                                { title: 'ID', field: 'id', 
                                    render: rowData => 
                                        <span><FontAwesomeIcon style={{ color: 'rgb(57, 165, 207)', borderRadius: '50%', verticalAlign: 'middle' }} icon={faParking } size="2x"/> {rowData.id}</span>,
                                    cellStyle: {
                                        fontWeight: '600'
                                    },
                                    headerStyle: {
                                        backgroundColor: 'rgb(145 195 234)',
                                    }
                                },
                                { title: 'Latitude', field: 'lat' },
                                { title: 'Longitude', field: 'lng'},
                                { title: 'Address', field: 'address'}
                            ]}
                            // onRowClick={((evt, selectedRow) => this.setState({userListSelectedRow: selectedRow.tableData.id }))}
                            options={{
                                actionsColumnIndex: -1,
                                sorting: true,
                                headerStyle: {
                                    backgroundColor: 'lightblue',
                                    color: 'black',
                                    fontWeight: 600, 
                                },
                                // rowStyle: rowData => ({
                                //     backgroundColor: (this.state.userListSelectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                                // })
                            }}
                            actions={[
                                {
                                    icon: tableIcons.AssignmentReturnRoundedIcon,
                                    tooltip: 'Return This Car',
                                    onClick: (event, rowData) => this.returnCar(rowData.id)
                                }
                            ]}
                            data={this.props.location.state[0]} />

            </div>
        )
    }
}
export default ReturnCarComponent;