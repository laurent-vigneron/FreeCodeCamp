import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id='display' className='card border-warning'>
        <div className='card-header text-center bg-warning'><strong>Name of sound</strong></div>
        <h2 className='card-body text-center'>{this.props.sound||''}</h2>
      </div>
    );
  }
}

class Keyboard extends React.Component {
  constructor(props) {
    super(props);
  }
  play(key, name) {
    const audio = document.querySelector(`audio[id="${key}"]`);
    if (audio) {
      addPlaying({keyCode: audio.parentElement.dataset.key});
      audio.currentTime = 0;
      audio.play();
      this.props.displaySound(name);
    }
  }
  render() {
    return (
      <div id='keyboard' className='container'>
        <div className='d-flex'>
          <button data-key='81' id='African Pi-He' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'Q', 'African Pi-He')}>Q
            <audio className='clip' id='Q' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/African%20and%20Eastern%20Percussion/80[kb]african-pe-hi.wav.mp3"></audio>
          </button>
          <button data-key='87' id='Verby Rattle' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'W', 'Verby Rattle')}>W
            <audio className='clip' id='W' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/African%20and%20Eastern%20Percussion/54[kb]verby-rattle.wav.mp3"></audio>
          </button>
          <button data-key='69' id='Tabla Hardhit' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'E', 'Tabla Hardhit')}>E
            <audio className='clip' id='E' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/African%20and%20Eastern%20Percussion/35[kb]tabla-hardhit.aif.mp3"></audio>
          </button>
        </div>
        <div className='d-flex pl-3'>
          <button data-key='65' id='909 Bright Ride' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'A', '909 Bright Ride')}>A
            <audio className='clip' id='A' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Rides/81[kb]909-bright-ride.aif.mp3"></audio>
          </button>
          <button data-key='83' id='Crispride' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'S', 'Crispride')}>S
            <audio className='clip' id='S' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Rides/87[kb]crispride.aif.mp3"></audio>
          </button>
          <button data-key='68' id='Ambient Tom 1' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'D', 'Ambient Tom 1')}>D
            <audio className='clip' id='D' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Toms/260[kb]ambient_tom_1.aif.mp3"></audio>
          </button>
        </div>
        <div className='d-flex pl-5'>
          <button data-key='90' id='Giant ElectroTom' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'Z', 'Giant ElectroTom')}>Z
            <audio className='clip' id='Z' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Toms/89[kb]giant-electrotom.aif.mp3"></audio>
          </button>
          <button data-key='88' id='Compressed OW' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'X', 'Compressed OW')}>X
            <audio className='clip' id='X' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Voice/113[kb]compressed_ow.aif.mp3"></audio>
          </button>
          <button data-key='67' id='Alien Telephone' className='drum-pad btn btn-lg btn-secondary' onClick={this.play.bind(this, 'C', 'Alien Telephone')}>C
            <audio className='clip' id='C' src="https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Electronic%20Hits/79[kb]alien-telephone.aif.mp3"></audio>
          </button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sound: '' };
  }
  displaySound = (name) => {
    this.setState({sound: name});
  }
  render() {
    return(
      <div className='row'>
        <div className='col-sm-4'><Keyboard displaySound={this.displaySound} /></div>
        <div className='col-sm-8'><Display sound={this.state.sound} /></div>
      </div>
    );
  }
}

function addPlaying(e) {
  const key = document.querySelector(`button[data-key="${e.keyCode}"]`);
  if (key) {
    key.classList.add('playing');
    key.addEventListener('transitionend', () => key.classList.remove('playing'));
    key.click();
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('drum-machine')
);
  
window.addEventListener('keydown', addPlaying);
