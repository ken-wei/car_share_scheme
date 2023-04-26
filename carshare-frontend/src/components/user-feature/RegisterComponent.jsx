import React, { Component } from "react";
import RegistrationService from "../../apis/RegistrationService";
import { Form, Button } from 'react-bootstrap'
import '../../css/Register.css'
import '../../App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserEdit, faEnvelope } from '@fortawesome/free-solid-svg-icons'
var hash = require('object-hash');


class RegisterComponent extends Component {
    constructor (props) 
    {
        super(props);
        this.state = 
        {
            username: "",
            password: "",
            error: ""
        }
    }

    handleInputID = event => 
    {
        this.setState( {username: event.target.value} )
    }

    handleInputPassword = event => 
    {
        this.setState( {password: event.target.value} )
    }

    handleInputName = event => 
    {
        this.setState( {name: event.target.value} )
    }

    registerClicked = event => 
    {
        event.preventDefault();
        RegistrationService.registerAccount({id: this.state.username, password: hash(this.state.password) , name: this.state.name})
        .then(    
            response => {
                if (response.status === 200) {
                    this.props.history.push('/login');
                }else{
                    this.setState({error: "true"});
                }
            }      
        ).catch ( error => {
            this.setState({error: "true"});
        })
    }

    render () 
    {
        return (
            <div className="form-outer">
                <div className="form-data">
                
                    <Form onSubmit={this.registerClicked}>
                        <h1>Sign Up</h1>
                        { this.state.error === "true" ? <div className="form-error-msg">Email has already been used!</div> : <div></div>} 
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="email" name="username" placeholder="Enter email" onChange={this.handleInputID} required/>
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleInputPassword} required/>
                                <FontAwesomeIcon icon={faUser}/>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="formGroupName">
                            <Form.Label>Full Name</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="text" placeholder="Full Name" name="name" onChange={this.handleInputName} required/>
                                <FontAwesomeIcon icon={faUserEdit}/>
                            </div>
                        </Form.Group>

                        <div className="form-button">
                            <Button variant="primary" className="submit" type="submit">Sign Up</Button>
                            <div className="not-a-member">Existing Member?</div>
                            <a href="/login">SIGN IN HERE</a>
                        </div>
                        
                    </Form>

                </div>
            </div>
        );
    }

}

export default RegisterComponent;