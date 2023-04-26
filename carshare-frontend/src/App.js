import React from 'react';
import './App.css';
import RegisterComponent from './components/user-feature/RegisterComponent';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HomeComponent from './components/car-feature/HomeComponent';
import HeaderComponent from './components/shared-components/HeaderComponent';
import LoginComponent from './components/user-feature/LoginComponent';
import WalletComponent from './components/wallet-feature/WalletComponent';
import CreateBookingComponent from './components/car-feature/CreateBookingComponent';
import BookingReceiptComponent from './components/car-feature/BookingReceiptComponent';
import ForgotPasswordComponent from './components/user-feature/ForgotPasswordComponent';
import checkAccountComponent from './components/user-feature/checkAccountComponent';
import AuthenticatedRoute from './components/user-feature/AuthenticatedRoute';
import BookingReceiptDetailComponent from './components/car-feature/BookingReceiptDetailComponent';
import AdminPageComponent from './components/user-feature/AdminPageComponent';
import ReturnCarComponent from './components/car-feature/ReturnCarComponent';
import IssueReportComponent from './components/car-feature/IssueReportComponent';
import IssueFormComponent from './components/car-feature/IssueFormComponent';
import AdminSolveIssueComponent from './components/user-feature/AdminSolveIssueComponent';
import ExtendBookingComponent from './components/car-feature/ExtendBookingComponent';

class App extends React.Component {
  render() {
    return (
      <div className="TouristApp">
        <Router>
          <HeaderComponent />
          <div className="content">
            <Switch>
              <Route path="/check-account" component={checkAccountComponent}/>
              <Route path="/login"      component={LoginComponent} />
              <Route path="/signup"   component={RegisterComponent} />
              <Route path="/home"   component={HomeComponent} />
              <Route exact path="/"     component={RegisterComponent}/>
              <Route path="/forgot-password" component={ForgotPasswordComponent}/>
              <Route path="/adminpage" component={AdminPageComponent} />
              <AuthenticatedRoute path="/wallet" component={WalletComponent} />
              <AuthenticatedRoute path="/book" component={CreateBookingComponent}/>
              <AuthenticatedRoute  path="/booking-receipt" component={BookingReceiptComponent}/>
              <AuthenticatedRoute  path="/booking-detail" component={BookingReceiptDetailComponent}/>
              <AuthenticatedRoute  path="/return-car" component={ReturnCarComponent}/>
              <AuthenticatedRoute  path="/issue" component={IssueReportComponent}/>
              <AuthenticatedRoute  path="/issue_form" component={IssueFormComponent}/>
              <AuthenticatedRoute  path="/solve-issue" component={AdminSolveIssueComponent}/>       
              <AuthenticatedRoute  path="/extend" component={ExtendBookingComponent}/>
            </Switch>
          </div>
          
          {/* <FooterComponent /> */}
        </Router>
        
      </div>
      
    ); 
  }
}

export default App;
