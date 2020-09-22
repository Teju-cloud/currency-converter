import  React,  { Component } from 'react';

import '../App.css';
class Converter extends Component {

    constructor(props) {
        super();
        this.state = {
            fromCurrency: "SELECT",
            toCurrency: "SELECT",
            amount: 0,
            outputAmount: 0,
            currencies: []
        }
    }

    componentDidMount() {
        const currencyAr = ["SELECT"];
        fetch("https://api.frankfurter.app/latest")
          .then(response => response.json())
          .then(result => {
            for (const key in result.rates) {
              currencyAr.push(key);
            }
            this.setState({ currencies: currencyAr });
          })
          .catch(err => {
            console.log("oppps", err);
          });
    }

    selectHandler = event => {
        if (event.target.name === "from") {
          this.setState({ fromCurrency: event.target.value });
        } else {
          if (event.target.name === "to") {
            this.setState({ toCurrency: event.target.value });
          }
        }
    };

    convertHandler = () => {
        if (this.state.fromCurrency !== this.state.toCurrency) {
          fetch(
              `https://api.frankfurter.app/latest?amount=${
                this.state.amount
              }&from=${this.state.fromCurrency}&to=${this.state.toCurrency}`
            )
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const output = result.rates[this.state.toCurrency];
                this.setState({outputAmount: output.toFixed(3)})
            })
            .catch(error => {
              console.log("Opps", error.message);
            });
        } else {
          this.setState({ outputAmount: "You cant convert the same currency!" });
        }
      };

    render() {
        return (
            <React.Fragment>
            <h1>CURRENCY CONVERTER</h1>
            <div className="container">
                <div className="box-container">
                <p>Input Amount</p>
                <input 
                    type="text"
                    name="inputAmount"
                    value={this.state.amount}
                    onChange={e => this.setState({ amount : e.target.value})} />
                <select 
                    name="from"
                    onChange={e => this.selectHandler(e)}
                    value={this.state.fromCurrency}>
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                </select>
               </div>

                <button onClick={this.convertHandler}>Convert</button>
                
                <div className="box-container">
                <p>Output Amount</p>
                <input        
                    type="text"
                    name="outputAmount"
                    value={this.state.outputAmount}
                    onChange={e => this.setState({outputAmount : e.target.value})}/>
                <select
                    name="to"
                    onChange={e=> this.selectHandler(e)}
                    value={this.state.toCurrency}>
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                </select>
                </div>
            </div>
            </React.Fragment>
        )
    }
}

export default Converter
