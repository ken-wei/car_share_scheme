import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthenticationService from "../../apis/AuthenticationService";

class AuthenticatedRoute extends Component {
    render() {
        // Check if there's a user logged in
        if (AuthenticationService.isUserLoggedIn()) {
            // Pass the props to Route Components
            return <Route {...this.props} />
        } else {
            // If there's no user logged in redirect to login page
            return <Redirect to="/login" />
        }
    }
}

export default AuthenticatedRoute;