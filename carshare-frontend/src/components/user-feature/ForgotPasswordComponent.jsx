import React, { Component } from "react";
import AuthenticationService from "../../apis/AuthenticationService";
import { Form, Button } from 'react-bootstrap';
import '../../css/Register.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'
var hash = require('object-hash');

class ForgotPasswordComponent extends Component {
    constructor (props) 
    {
        super(props);
        this.state = 
        {   
            username: "",
            password: "",
            exist:true,
            error: "",
            compare: ""
        }
    }

    componentDidMount() {
        // Do Nothing For Now
    }

    // Handle the event input ID
    handleInputID = event => 
    {
        this.setState( {username: event.target.value} )
    }

    // Handle the password entered in the text field
    handleInputPassword = event => 
    {
        this.setState( {password: event.target.value} )
    }

    // Check user's account
    checkAccount() {
        const { username } = this.props.location
        AuthenticationService.forgotPassword({username:username,password:hash(this.secondInput.value)}).then(    
            response => {
                if (response.status === 200) {
                    this.props.history.push('/login');
                }
            }      
        ).catch ( error => {
            this.setState({error: "true"});
        })
    }

    // Compare two input fields if they are the same
    comparePassword(event){
        event.preventDefault(); //incase you want to prevent certain things from happening
       
        if (this.firstInput.value === this.secondInput.value) {
            this.setState({error: "false"});
            this.setState({exist: false})
        } else {
            this.setState({error: "true"});
        }
    }

    render(){
        const { username } = this.props.location
        return (
            
            <div className="form-outer">
                <div className="form-data">
                
                    <Form >
                        <h1>Forgot Password</h1>
                        { this.state.error === "true" ? <li className="form-error-msg">The password is not the same!</li> : <div></div>}
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="email" name="username"  onChange={this.handleInputID}  disabled placeholder={username} />
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </div>
                        </Form.Group>
                        <Form.Group >

                            <Form.Label>New Password</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="password"  ref={input => { this.firstInput = input }} onChange={e => this.comparePassword(e)} /> 
                                <FontAwesomeIcon icon={faUnlockAlt}/>
                            </div>

                            <Form.Label>Confirm Password</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="password"  ref={input => { this.secondInput = input }} onChange={e => this.comparePassword(e)} />
                                <FontAwesomeIcon icon={faUnlockAlt}/>
                            </div>
                        </Form.Group>

                        <div className="form-button">
                            <Button className="submit" disabled={this.state.exist} onClick={()=>this.checkAccount()}>
                                Reset
                            </Button>
                            <div><a href="/login">Back to Login {">"}</a></div>
                        </div>  
                    </Form>
                </div>
            </div>
 
        )
    }
}
export default ForgotPasswordComponent;
