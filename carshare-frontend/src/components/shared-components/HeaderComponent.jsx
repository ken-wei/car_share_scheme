import React, { Component } from "react";
import { Navbar, Nav } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import AuthenticationService from "../../apis/AuthenticationService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credit: 0,
            username:"",
            booking:[]
        }        
        this.state.username = AuthenticationService.getCurrentUser()
    }

    render () {
        // const isUserloggedIn = AuthenticationService.isUserLoggedIn();

        return (
            <header>
                <Navbar variant="dark" className="nav-bar">
                    <Navbar.Brand href="/home">Car Share</Navbar.Brand>
                    <Nav className="mr-auto" >
                        {AuthenticationService.isTheCurrentUserAdmin() ?
                                <Nav.Link href="/adminpage" className="nav-bar-button">Management</Nav.Link>
                            :
                                <Nav.Link></Nav.Link>
                        }
                        { AuthenticationService.isUserLoggedIn() && !AuthenticationService.isTheCurrentUserAdmin() && <Nav.Link href="/home" className="nav-bar-button">Home</Nav.Link> }
                        { AuthenticationService.isUserLoggedIn() && !AuthenticationService.isTheCurrentUserAdmin() && <Nav.Link href="/wallet" className="nav-bar-button">Wallet</Nav.Link> }
                        { AuthenticationService.isUserLoggedIn() && !AuthenticationService.isTheCurrentUserAdmin() && <Nav.Link href="/booking-receipt" className="nav-bar-button">My Booking</Nav.Link>}
                        { AuthenticationService.isUserLoggedIn() && !AuthenticationService.isTheCurrentUserAdmin() && <Nav.Link href="/issue" className="nav-bar-button">Issues</Nav.Link> }
                        

                    </Nav>

                    <Nav className="navbar-right">
                        { !AuthenticationService.isUserLoggedIn() && <Nav.Link href="/login" className="nav-bar-button"><FontAwesomeIcon icon={faUser}/> Login</Nav.Link>}
                        { AuthenticationService.isUserLoggedIn() && <Nav.Link href="/login "  className="nav-bar-button"onClick={AuthenticationService.logout}><FontAwesomeIcon icon={faSignOutAlt}/> Logout</Nav.Link> }                       
                    </Nav> 
                </Navbar>
            </header>
        )
    }          
}

export default withRouter(HeaderComponent);