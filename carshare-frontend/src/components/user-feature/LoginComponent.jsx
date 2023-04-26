import React, { Component } from "react";
import AuthenticationService from "../../apis/AuthenticationService";
import { Form, Button } from 'react-bootstrap';
import '../../css/Register.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUnlockAlt } from '@fortawesome/free-solid-svg-icons'
var hash = require('object-hash');

class LoginComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: "false"
        }
        this.loginClicked = this.loginClicked.bind(this)
    }

    componentDidMount() {
    }

    handleID = event => {
        this.setState({ username: event.target.value });
    }

    handlePassword = event => {
        this.setState({ password: event.target.value });
       
    }

    loginClicked = event => {
        event.preventDefault();
        AuthenticationService.authenticate({username: this.state.username, password: hash(this.state.password)})
        .then (
            response => {
                console.log(response.data.admin === false)
                if (response.status === 200) {
                    AuthenticationService.registerSuccessfulLogin(this.state.username)
                    if (response.data.admin === false) {
                        AuthenticationService.isAdmin("not_admin")
                    } else {
                        AuthenticationService.isAdmin("admin")
                    }
                    
                    console.log(AuthenticationService.isTheCurrentUserAdmin())
                    if (response.data.admin) {
                        this.props.history.push(`/adminpage`)
                    }
                    else {
                        this.props.history.push(`/home`);
                    }
                }
            }
        ).catch ( error => {
            this.setState({error: "true"});
        })

    }


    render() {
        return (
            <div className="form-outer">
                <div className="form-data">
                
                    <Form onSubmit={this.loginClicked}>
                        <h1>Sign In</h1>
                        { this.state.error === "true" ? <li className="form-error-msg">Invalid Email or Password !</li> : <div></div>}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <div className="inputWithIcon">
                                <Form.Control type="email" name="username" placeholder="Enter email" onChange={this.handleID} required/>
                                <FontAwesomeIcon icon={faUser}/>
                            </div>
                            {/* <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text> */}
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="password-field">
                            <Form.Label>Password</Form.Label><a href="/check-account">Forgot Password?</a>
                            <div className="inputWithIcon">
                                <Form.Control type="password" name="password" placeholder="Password" onChange={this.handlePassword} required />
                                <FontAwesomeIcon icon={faUnlockAlt}/>
                            </div>
                        </Form.Group>

                        <div className="form-button">
                            <Button variant="primary" className="submit"  type="submit">Login</Button>
                            <div className="not-a-member">Not a member?</div>
                            <a href="/signup">SIGN UP NOW</a>
                        </div>  
                    </Form>

                </div>
            </div>
        
        );
    }

}

export default LoginComponent;