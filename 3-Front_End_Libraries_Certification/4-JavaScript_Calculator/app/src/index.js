import React from 'react';
import ReactDOM from 'react-dom';
import {evaluate} from 'mathjs';
import './index.css';

class Display extends React.Component {
  render() {
    return(<button id='display' className='btn btn-lg btn-dark text-right'>{this.props.output}</button>);
  }
}

class NumPad extends React.Component {
  render() {
    let numStyle = 'btn btn-lg btn-info';
    return(
      <div id='numpad'>
          <button id='clear' className={numStyle} value='c' onClick={this.props.handleInput.bind(this)}>CE</button>
          <button id='divide' className={numStyle} value='/' onClick={this.props.handleInput.bind(this)}>&#247;</button>
          <button id='one' className={numStyle} value='1' onClick={this.props.handleInput.bind(this)}>1</button> 
          <button id='two' className={numStyle} value='2' onClick={this.props.handleInput.bind(this)}>2</button>
          <button id='three' className={numStyle} value='3' onClick={this.props.handleInput.bind(this)}>3</button>
          <button id='multiply' className={numStyle} value='*' onClick={this.props.handleInput.bind(this)}>&#215;</button>
          <button id='four' className={numStyle} value='4' onClick={this.props.handleInput.bind(this)}>4</button>
          <button id='five' className={numStyle} value='5' onClick={this.props.handleInput.bind(this)}>5</button>
          <button id='six' className={numStyle} value='6' onClick={this.props.handleInput.bind(this)}>6</button>
          <button id='add' className={numStyle} value='+' onClick={this.props.handleInput.bind(this)}>+</button>
          <button id='seven' className={numStyle} value='7' onClick={this.props.handleInput.bind(this)}>7</button>
          <button id='eight' className={numStyle} value='8' onClick={this.props.handleInput.bind(this)}>8</button>
          <button id='nine' className={numStyle} value='9' onClick={this.props.handleInput.bind(this)}>9</button>
          <button id='subtract' className={numStyle} value='-' onClick={this.props.handleInput.bind(this)}>-</button>
          <button id='zero' className={numStyle} value='0' onClick={this.props.handleInput.bind(this)}>0</button>
          <button id='decimal' className={numStyle} value='.' onClick={this.props.handleInput.bind(this)}>.</button>
          <button id='equals' className={numStyle} value='=' onClick={this.props.handleInput.bind(this)}>=</button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: '0',
      total: 0
    }
  }
  handleInput = (e) => {
    switch(e.target.value){
      case 'c': this.setState({output: '0', total: 0}); break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0': 
        if (this.state.total === 0) {
          this.setState({output: this.state.output === '0' ? e.target.value : this.state.output + e.target.value }); break;
        } else {
          this.setState({output: e.target.value, total: 0}); break;
        }
      case '+':
      case '*':
      case '/':
        if (this.state.total !== 0) { this.setState({total: 0})}
        if (this.state.output!=='0'){  
          if (this.state.output.slice(-1)===' '){ // last input was not a number, replace it
            let parts = this.state.output.split(' '); // for when a sign before a minus
            for (let i=parts.length-1; i>=0; i--){
              if (parts[i]>= '0' && parts[i] <= '9'){
                break;
              } else { 
                parts.pop(); // remove everything until the last number
              }
            }          
            this.setState({output: parts.join(' ')+' '+e.target.value + ' '})
          } else if (this.state.output.slice(-1)==='.'){
            this.setState({output: this.state.output.slice(0, -1)+' '+e.target.value + ' '})
          } else { // otherwise add the correct sign
            this.setState({output: this.state.output+' '+e.target.value+' '});
          }
        }
        break;
      case '-':
          if (this.state.output!=='0'){
            if (this.state.output.slice(-1)===' '){
              this.setState({output: this.state.output+e.target.value+' '});
            } else {
              if (this.state.output.slice(-1)==='.'){
                this.setState({output: this.state.output.slice(0, -1)+' '+e.target.value + ' '})
              } else { // otherwise add the minus sign
                this.setState({output: this.state.output+' '+e.target.value+' '});
              }
            }
          }
        break;
      case '.':
        let parts = this.state.output.split(' ');
        if (!parts[parts.length-1].includes('.')) {
          if (this.state.output.slice(-1)!=='.') {
            this.setState({output: this.state.output+'.'});
          }
        }
        break;
      case '=':
        this.setState({output: evaluate(this.state.output).toString()});
        this.setState({total: this.state.output});
        break
      default: console.log(this.state);
    }
  }
  render() {
    return(
      <div id='calc'>
        <Display output={this.state.output} />
        <NumPad handleInput={this.handleInput}/>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

