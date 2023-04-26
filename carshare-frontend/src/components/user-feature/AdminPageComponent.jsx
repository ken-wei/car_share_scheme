import React, { Component } from 'react'
import AuthenticationService from "../../apis/AuthenticationService";
import { ButtonGroup, Button } from 'react-bootstrap';
import CarBookingService from '../../apis/CarBookingService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import '../../css/AdminPage.css'
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
    InputIcon: forwardRef((props, ref) => <InputIcon {...props} ref={ref} />)
  };

class AdminPageComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            bookings: [],
            issues: [],
            sortedIssues: [],
            userListSelectedRow: '',
            user_tab_selected: false,
        }        
    }

    componentDidMount(){
        this.retrieveAllExistingUsers()
        this.retrieveAllIssues()
    }

    // Retrieve all existing users from the backend
    retrieveAllExistingUsers = () => {
        AuthenticationService.getAllUsers()
        .then(
            (response) => { 
                if (response.status === 200 ) {
                    this.setState({users: response.data})
                }
            }).catch( error =>{
                // Error Handling
            }
        )
    }

    // Retrieve all issues from the backend
    retrieveAllIssues = () => {
        CarBookingService.retrieveAllIssues()
        .then(
            (response) => { 
                if (response.status === 200 ) {
                    this.setState({issues: response.data})
                }
            }).catch( error =>{
                // Error Handling
            }
        )
    }

    // Push to solve issue details page
    checkIssue(issueId) {
        this.props.history.push("/solve-issue", issueId)
    }

    // Update when "Users" or "Issues" are selected
    updateTabBarSelected = () => {
        this.setState({user_tab_selected: !this.state.user_tab_selected})
    }

    render() {
        return(
            <div>
                <div className="admin-tab-bar-container">
                    <ButtonGroup className="admin-tab-bar-group">
                        <Button variant="secondary" className={!this.state.user_tab_selected ? "admin-tab-bar admin-tab-bar-active" : "admin-tab-bar" }
                            onClick={this.updateTabBarSelected}>
                            Issues
                        </Button>
                        <Button variant="secondary" className={this.state.user_tab_selected ? "admin-tab-bar admin-tab-bar-active" : "admin-tab-bar" }
                            onClick={this.updateTabBarSelected}>
                            Users
                        </Button>
                    </ButtonGroup>
                </div>

                { this.state.user_tab_selected 
                    ?
                        <MaterialTable
                            icons={tableIcons}
                            title="User List"
                            columns={[
                                { title: 'ID', field: 'id', 
                                    render: rowData => 
                                        <span><FontAwesomeIcon style={{ color: 'rgb(57, 165, 207)', borderRadius: '50%', verticalAlign: 'middle' }} icon={faUserCircle } size="2x"/> {rowData.id}</span>,
                                    cellStyle: {
                                        fontWeight: '600'
                                    },
                                    headerStyle: {
                                        backgroundColor: 'rgb(145 195 234)',
                                    }
                                },
                                { title: 'Full Name', field: 'name' },
                                { title: 'Credit Score', field: 'credit'}
                            ]}
                            onRowClick={((evt, selectedRow) => this.setState({userListSelectedRow: selectedRow.tableData.id }))}
                            options={{
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
                            data={this.state.users}
                        />
                    :
                        <MaterialTable
                            icons={tableIcons}
                            title="Issues List"
                            columns={[
                                { title: 'Issue ID', field: 'id', 
                                    cellStyle: {
                                        fontWeight: '600'
                                    },
                                    headerStyle: {
                                        backgroundColor: 'rgb(145 195 234)',
                                    }
                                },
                                { title: 'Booking ID', field: 'bookingId' },
                                { title: 'Car ID', field: 'carId' },
                                { title: 'Solved', field: 'solved',
                                render: rowData => 
                                    rowData.solved ? <span className="solved-text">SOLVED </span>: <span className="unsolved-text">UNSOLVED</span>    
                                } 
                            ]}
                            onRowClick={((evt, selectedRow) => this.setState({issueSelectedRow: selectedRow.tableData.id }))}
                            actions={[
                                {
                                icon: tableIcons.InputIcon,
                                tooltip: 'Solve This Issue',
                                onClick: (event, rowData) => this.checkIssue(rowData.id)
                                }
                            ]}
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
                            data={this.state.issues}
                        />
                }
        
            </div>
        )
    }
}

export default AdminPageComponent;