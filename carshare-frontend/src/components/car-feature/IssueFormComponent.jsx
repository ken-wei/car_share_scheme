import React, { Component } from "react";
import AuthenticationService from "../../apis/AuthenticationService";
import styled, { css } from 'styled-components';
import CarBookingService from "../../apis/CarBookingService";

const sharedStyles = css`
  background-color: #eee;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin: 10px 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  ${sharedStyles}
`;

const StyledTextArea = styled.textarea`
  background-color: #eee;
  width: 100%;
  min-height: 100px;
  resize: none;
  ${sharedStyles}
`;
const StyledButton = styled.button`
  display: block;
  background-color: #f7797d;
  color: #fff;
  font-size: 0.9rem;
  border: 0;
  border-radius: 5px;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  box-sizing: border-box;
  float: right;
`;

const StyledFieldset = styled.fieldset`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 20px 0;
  legend {
    padding: 0 10px;
  }
  label {
    padding-right: 20px;
  }
  input {
    margin-right: 10px;
  }
`;

const StyledError = styled.div`
  color: red;
  font-weight: 800;
  margin: 0 0 40px 0;
`;

class IssueFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carId: '',
            title: '',
            category: '',
            description: '',
            error: false,
            error_msg: '',
            bookings: [],
            bookingsTemp: [],
            bookingId:''
        }
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    componentDidMount(){
      console.log(this.state)
      CarBookingService.getCurrentBooking({userid:AuthenticationService.getCurrentUser()})
        .then(
            response=>{
              for (var i=0;i<response.data.length;i++){
                // console.log(response.data[i])
                this.state.bookingsTemp.push(response.data[i])
              }
              this.setState({
                bookings: this.state.bookingsTemp,
                carId: this.state.bookingsTemp[0].carId,
                bookingId: this.state.bookingsTemp[0].id
              })
              console.log(this.state.carId)
            }
        ).catch( error =>{
            this.setState({error: "true"});
        })
      

      // console.log(this.state)
    }

    // Method to handle the submission of the report form
    handleSubmit = e => {
        e.preventDefault();
        // console.log(this.state)
        // Check each state whether if it's empty, then set the error msg
        for (let key in this.state) {
            if (key !== 'error' && key !== 'error_msg') {
                console.log(key)
                if (this.state[key] === '') {
                    this.setState({ error: true, error_msg: `You must provide the ${key}`})
                    return
                }
            }
        }
        var username = AuthenticationService.getCurrentUser()
        // console.log(this.state.bookings.id)
        var issue_case = {
                    username: username,  
                    carId: this.state.carId.substring(7,11),
                    title: this.state.title,
                    category: this.state.category,
                    bookingId: this.state.carId.substring(23,39),
                    description: this.state.description,
                }

        // console.log(issue_case)
        CarBookingService.reportIssue(issue_case).then(
            response => {
                this.props.history.push(`/issue`)
            }
        )
            
    }

    // Handle the input for each input field inside the form
    handleInput = e => {
        const inputName = e.currentTarget.name;
        const value = e.currentTarget.value;
        this.setState(prev => ({ ...prev, [inputName]: value }));
    }

    handleChange = e => {
      this.setState({
        carId: e.target.value
        
      })
    }

    render() {
        return (
            <div className="issue-report">
            <StyledFormWrapper>
                <StyledForm onSubmit={this.handleSubmit}>
                
                <h2>Report Issue Form</h2>
                <label htmlFor="title">Car ID</label>
                <br></br>
                <select  onChange={this.handleChange}>
                <option value="" disabled selected>Select your option</option>

                  {this.state.bookings.map(booking =>
            
            <option  key={booking.id}>CarId: {booking.carId} BookingId: {booking.id}</option>
            
                  )}
                </select>
                <br></br>
                <label htmlFor="title">Title</label>
                <StyledInput
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleInput}
                />
                <StyledFieldset>
                    <legend>Issue Category</legend>
                    <label>
                    <input
                        type="radio"
                        value="Missing"
                        name="category"
                        checked={this.state.category === 'Missing'}
                        onChange={this.handleInput}
                    />
                    Missing
                    </label>
                    <label>
                    <input
                        type="radio"
                        value="Damaged"
                        name="category"
                        checked={this.state.category === 'Damaged'}
                        onChange={this.handleInput}
                    />
                    Damaged
                    </label>
                </StyledFieldset>
                <label htmlFor="description">Description</label>
                <StyledTextArea
                    name="description"
                    value={this.state.description}
                    onChange={this.handleInput}
                />
                {this.state.error && (
                    <StyledError>
                    <p>{this.state.error_msg}</p>
                    </StyledError>
                )}
                <StyledButton type="submit">Send Report</StyledButton>
                </StyledForm>

            </StyledFormWrapper>
            </div>
        );
    }

}

export default IssueFormComponent;