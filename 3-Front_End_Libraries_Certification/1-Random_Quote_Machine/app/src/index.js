import React from 'react';
import ReactDOM from 'react-dom';

const quotes = [
  { id: 1,
    quote: 'The more a thing tends to be permanent, the more it tends to be lifeless.',
    author: 'Alan Watts' },
  { id: 2,
    quote: "Whoever fights monsters should see to it that in the process he does not become a monster. And if you gaze long enough into an abyss, the abyss will gaze back into you.",
    author: "Friedrich Nietzsche" },
  { id: 3,
    quote: 'First say to yourself what you would be; and then do what you have to do.',
    author: 'Epictetus' },
  { id: 4,
    quote: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney' },
  { id: 5,
    quote: 'Life is what happens when you\'re busy making other plans.',
    author: 'John Lennon' }
  ];

  class QuoteDisplay extends React.Component {
    constructor(props) {
      super(props);
      this.state = quotes[0];
    }
    
    submitNew() {
      let eligible = quotes.filter(quote => quote.id != this.state.id);
      this.setState( eligible[Math.floor( Math.random() * eligible.length)]);
    }
    
    render() {
      return (
        <div className='card'>
          <div className='card-body'>
            <h1 id='text' className='card-title text-center'>{this.state.quote}</h1>
            <h2 id='author' className='card-text text-right text-info'>~{this.state.author}</h2>
          </div>
          <div className='card-body text-right'>
            <button id='new-quote' className="btn btn-primary" onClick={this.submitNew.bind(this)} type='button'>New Quote</button>
            <a id='tweet-quote' className="btn btn-outline-info ml-3" target='_blank' href='twitter.com/intent/tweet'>Tweet That Quote!</a>
            </div>
        </div>
      )
    }
  }

ReactDOM.render(
  <React.StrictMode>
    <QuoteDisplay />
  </React.StrictMode>,
  document.getElementById('quote-box')
);

