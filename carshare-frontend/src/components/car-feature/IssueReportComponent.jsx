import React, { Component } from "react";
import AuthenticationService from "../../apis/AuthenticationService";
import CarBookingService from "../../apis/CarBookingService";
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
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

const StyledButton = styled.button`
  display: inline-block;
  background-color: #f7797d;
  color: #fff;
  font-size: 0.9rem;
  border: 0;
  border-radius: 5px;
  height: 40px;
  padding: 5px 20px;
  margin: 0 30px 10px 0;
  cursor: pointer;
  box-sizing: border-box;
`;

const StyledDiv = styled.div`
    text-align: right;
    margin: 10px 0;
`;

// const StyledHeader = styled.div`
//     display: inline-block;
//     font-weight: 800;
//     color: black;
//     font-size: 1.5rem;
//     padding: 0 20px;
// `;

class IssueReportComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            issues: [],
        }
    }

    componentDidMount() {
        // Get username from the session
        var username = AuthenticationService.getCurrentUser()
        // Get User's issues from the backend and update the state
        CarBookingService.getUserIssues(username).then(
            response => {
                console.log(response.data)
                if (response.status === 200) {
                    this.setState({issues: response.data})
                } 
            }
        )
    }

    // Push to form page for filling in details
    go_to_report_form = () => {
        this.props.history.push(`/issue_form`)
    }


    render() {
        return (
            <div className="issue-report" style={{marginTop: '20px'}}>
                <StyledDiv>
                    <StyledButton onClick={this.go_to_report_form}>+ Report Issue</StyledButton>
                </StyledDiv>

                <MaterialTable
                    icons={tableIcons}
                    title="My Issues"
                    columns={[
                        { title: 'ID', field: 'id',
                            cellStyle: {
                                fontWeight: '600'
                            },  
                            headerStyle: {
                                backgroundColor: 'rgb(145 195 234)',
                            }
                        },
                        { title: 'Category', field: 'category' },
                        { title: 'Title', field: 'title'},
                        { title: 'Comment', field: 'comment', render: rowData => rowData.comment ? rowData.comment : "N/A" },
                    { title: 'Status', field: 'solved', render: rowData => 
                        rowData.solved ? 
                            <span style={{ color: 'rgb(32, 190, 32)', fontWeight: '700'}}>
                                <FontAwesomeIcon style={{ color: 'rgb(32, 190, 32)', borderRadius: '50%', verticalAlign: 'middle', marginRight: '5px' }} icon={faCheckCircle } size="lg"/>
                                {"Solved"}
                            </span> 
                                    : 
                            <span style={{color: 'rgb(199, 199, 35)', fontWeight: '700' }}>
                                <FontAwesomeIcon style={{ color: 'rgb(199, 199, 35)', borderRadius: '50%', verticalAlign: 'middle', marginRight: '5px' }} icon={faExclamationCircle } size="lg"/>
                                {"Pending"}
                            </span> 
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
                    }}
                    data={this.state.issues} 
                />
            </div>
        
        );
    }

}

export default IssueReportComponent;