import React from 'react'
import $ from 'utils/selector'
import './transaction.styles.scss'

class Transaction extends React.Component {
    state = {
        customer_id: 1,
        trx_amount: 0
    }
    onAmountChange = (event) => {
        this.setState({trx_amount: event.target.value});
    }
    onEnterAmount = (event) => {
        if(event.key === 'Enter'){
            this.onSubmitTransaction()
        }
    }
    onSubmitTransaction = () => {
        const {linkApi} = this.props;
        fetch(linkApi + 'transaction', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(response => response.json())
        .then(data => {
            const message = data[0].message;
            if(message){
                (message.match(/berhasil/gmi))
                ? $('.transaction-result').innerHTML = `<p class="green lighten-3">${message}</p>`
                : $('.transaction-result').innerHTML = `<p class="orange lighten-3">${message}</p>`
            }
        })
    }
    render(){
        return (
            <div className="container">
                <div className="form-transaction">
                    <h1>Laman Transaksi</h1>
                    <div className="input-field">
                        <input onChange={this.onAmountChange} onKeyDown={this.onEnterAmount} type="number" name="trx_amount" id="trx_amount"/>
                        <label htmlFor="trx_amount">Jumlah Transaksi ( Rupiah )</label>
                    </div>
                    <button onClick={this.onSubmitTransaction} className="btn waves-effect waves-light blue">Kirimkan</button>
                </div>
                <div className="transaction-result"></div>
            </div>
        )
    }
}

export default Transaction;