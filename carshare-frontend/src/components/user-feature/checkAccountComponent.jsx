import React, { Component } from "react";
import AuthenticationService from "../../apis/AuthenticationService";
import { Form, Button } from 'react-bootstrap';
import '../../css/Register.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

class checkAccountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            error: false,
            exist: false,
            errorMessage: "No such user",
        }
     
    }

    componentDidMount(){
        // Doing nothing for forgot password
    }

    handleInputID = event => 
    {
        this.setState( {username: event.target.value} )
    }


    CheckClicked = event => {
        event.preventDefault();
        AuthenticationService.getUsers({username:this.state.username})      
        .then (
            response => {
                if (response.status === 200) {
                    this.props.history.push({
                        pathname: '/forgot-password',
                        username: this.state.username // your data array of objects
                      })
                }
            }
        ).catch ( error => {
            this.setState({error: "true"});
        })

    }
    
    render(){
        return(
            
            <div className="form-outer">
                <div className="form-data">
                
                    <Form onSubmit={this.CheckClicked}>
                        <h1>Forgot Password</h1>
                        { 
                            this.state.error === "true" 
                            ? 
                                <li className="form-error-msg">Invalid Email/The Email does not exist!</li> 
                            : 
                                <div></div>
                        }
                            
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="email" name="username"  onChange={this.handleInputID} required placeholder="Enter email" />
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </div>
                        </Form.Group>
    
                        <div className="form-button">
                            <Button variant="primary" className="submit" type="submit" >Next</Button>
                            <div><a href="/login">Back to Login {">"}</a></div>
                        </div>    
                    </Form>   
                </div>
            </div>
 
        )
    }

}

export default checkAccountComponent;
