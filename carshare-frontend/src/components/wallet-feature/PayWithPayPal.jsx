import React, { useState, useEffect, useRef } from 'react'
import WalletService from '../../apis/WalletService'

function PayWithPayPal (props) {
    const { items, total } = props
    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);
    const paypalRef = useRef();

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            description: 'Add Balance',
                            amount: {
                                currency_code: 'AUD',
                                value: total,
                            }
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    setPaidFor(true);
                    console.log('ORDER', order);
                },
                onError: err => {
                    setError(err);
                    console.error('ERROR', err);
                },
            })
            .render(paypalRef.current);
    }, [items, total]);

   


    if (paidFor) {
        // var money= WalletService.retrieveBalance(items)
        WalletService.updateBalance(items,total)
        return (
            <div className = "app">
                <div className="input-box">
                    Funds have been successfully added! Thank you. {items}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className = "app">
                <div className="input-box">
                    <div className="error-balance">Error adding funds. Please try again!</div>
                    
                </div>
            </div>
        )
    }

    return (
        <div className = "app">
            <div className="input-box">
                <div className="total-aud-title">Total - AUD {total}</div>
                <div ref={paypalRef} />
            </div>
        </div>
    )
}

export default PayWithPayPal