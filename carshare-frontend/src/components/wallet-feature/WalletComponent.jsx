import React from "react"
import WalletService from '../../apis/WalletService'
import AuthenticationService from "../../apis/AuthenticationService";
import '../../css/Wallet.css'
import PayWithPayPal from "./PayWithPayPal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faDollarSign } from '@fortawesome/free-solid-svg-icons'

class Wallet extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newBalance: 0,
            balance: 0,
            toggleShow: true,
            isAddedBalance:false,
        }
        this.componentDidMount = this.componentDidMount.bind(this);        
    }
    componentDidMount(){
        this.getBalance()
    }

    getBalance(){
        WalletService.retrieveBalance(AuthenticationService.getCurrentUser())
            .then(
                response => {
                    this.setState({ balance: response.data['balance'] })
                }
            )
        // console.log(this.state)
    }

    updateBalance(){
        WalletService.updateBalance(AuthenticationService.getCurrentUser() ,0)
        .then(    
            response => {
                if (response.status === 200) {
                    // this.props.history.push('/login');
                    this.setState({
                        balance : response.data['balance']
                    })
                }

            console.log(response)
            }      
        ).catch ( error => {
            this.setState({error: "true"});
        })
     
        this.setState({isAddedBalance:true})
      
    }
    
    handleTopUp = e =>{
        this.setState({
            newBalance: parseInt(e.target.value)
        });
        // console.log(this.state)
       
    }

    handleToggle(){
        if(this.state.toggle){
            this.setState({
                toggle: false
            })
        }
        else{
            this.setState({
                toggle: true
            })
        }
    }

   

    render(){
        if (this.state.isAddedBalance){
            return (
                <PayWithPayPal
                total={this.state.newBalance}
                items={AuthenticationService.getCurrentUser()}
                />

            )
        }
        

        return(
        <div className = "app">
            
            <div className = "input-box">
                <div className="wallet-page-title">
                    <FontAwesomeIcon icon={faWallet} size="2x"/>
                    <h2>Your Wallet</h2>
                </div>
                <div id="description">
                    <div className="balance-title">Available Balance</div>
                    <div className="balance">
                        <FontAwesomeIcon icon={faDollarSign} size="2x" />
                        <div>{this.state.balance}</div>
                    </div>
                </div>
                
                    {this.state.toggle?
                    <div>
                        <form className="form-group" >
                            <div className="top-up-title">Enter Amount to Top Up</div>
                            <input onChange={this.handleTopUp} 
                                className = "form-control" id = "username">
                            </input>
                                
                        </form>
                        <div className="button-group">
                            <button className="btn btn-success left top-up-button" onClick={()=>this.updateBalance()}>
                                Add
                            </button>
                            <button className="btn btn-danger right cancel-button" onClick={()=>this.handleToggle()}>
                                Cancel
                            </button>
                        </div>
                        
                        <br/>
                    </div>
                    
                    :
                    <div>
                        <button className="btn btn-success add-balance" onClick={()=>this.handleToggle() }>Add Funds</button>
                    </div>
                    }
            </div>
            
        </div>
        )
    }
}
export default Wallet;