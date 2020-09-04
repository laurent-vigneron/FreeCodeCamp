import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class SetBreak extends React.Component {
  render() {
    return (
      <div className="card border-info">
        <div id="break-label" className="card-header text-center">
          <strong>Break Length</strong>
        </div>
        <div className="card-body p-0">
          <h2 id="break-length" className="text-info text-center">{this.props.break}</h2>
        </div>
        <div className="card-footer btn-group btn-group-lg" role="group">
          <button
            id="break-increment"
            className="btn btn-primary"
            onClick={this.props.setBreak.bind(this, 1)}
          >+</button>
          <button
            id="break-decrement"
            className="btn btn-danger"
            onClick={this.props.setBreak.bind(this, -1)}
          >-</button>
        </div>
      </div>
    );
  }
}

class SetSession extends React.Component {
  render() {
    return (
      <div className="card border-info">
        <div id="session-label" className="card-header text-center">
          <strong>Session Length</strong>
        </div>
        <div className="card-body p-0">
          <h2 id="session-length" className="text-info text-center">{this.props.session}</h2>
        </div>
        <div className="card-footer btn-group btn-group-lg" role="group">
          <button
            id="session-increment"
            className="btn btn-primary"
            onClick={this.props.setSess.bind(this, 1)}
          >+</button>
          <button
            id="session-decrement"
            className="btn btn-danger"
            onClick={this.props.setSess.bind(this, -1)}
          >-</button>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    let mins = ("0" + this.props.mins).slice(-2);
    let secs = ("0" + this.props.secs).slice(-2);
    let stage = this.props.stage;
    return (
      <div className='text-center'>
        <div id="timer-label" className='text-center'><h2>{stage}</h2></div>
        <div id="time-left" className='text-center'><h1 className={`${mins==='00'?'text-danger':'text-info'}`}>{mins}:{secs}</h1></div>
        <div className="d-flex justify-content-around mt-3 row">
          <button
            id="start_stop"
            className="btn btn-info btn-block"
            onClick={this.props.play}
          >pause/resume</button>
          <button
            id="reset"
            className="btn btn-info btn-block"
            onClick={this.props.reset}
          >reset</button>
        </div>
      </div>
    );
  }
}

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      status: "paused",
      stage: "Session",
      mins_remain: 25,
      secs_remain: 0
    };
  }
  setBreak = (offset) => {
    if (61 > this.state.break + offset && this.state.break + offset > 0) {
      this.setState({ break: this.state.break + offset });
    }
  };
  setSess = (offset) => {
    if (61 > this.state.session + offset && this.state.session + offset > 0) {
      this.setState({
        session: this.state.session + offset,
        mins_remain: this.state.session + offset,
        stage: "Session",
        secs_remain: 0,
        status: "paused"
      });
    }
  };
  decClock = () => {
    let mins = this.state.mins_remain;
    let secs = this.state.secs_remain;
    let status = this.state.status;

    if (status !== "paused") {
      if (mins === 0 && secs === 0) {
        //this.state.audio.play();
        this.setState({
          stage: this.state.stage === "Session" ? "Break" : "Session",
          mins_remain: this.state.stage === "Session" ? this.state.break : this.state.session,
          secs_remain: 0
        });
      } else if (secs < 1) {
        this.setState({
          mins_remain: this.state.mins_remain - 1,
          secs_remain: 59
        });
      } else {
        this.setState({ secs_remain: this.state.secs_remain - 1 });
      }
      if (this.state.mins_remain === 0 && this.state.secs_remain === 0) {
        this.state.audio.play();
      }
    }
  };
  togglePlay = () => {
    this.setState({
      status: this.state.status === "paused" ? "running" : "paused"
    });
  };
  resetClock = () => {
    this.state.audio.pause();
    this.state.audio.currentTime = 0;
    this.setState({
      stage: "Session",
      mins_remain: 25,
      secs_remain: 0,
      session: 25,
      break: 5,
      status: "paused"
    });
  };
  componentDidMount() {
    const audio = document.querySelector("audio");
    this.setState({ audio: audio });
    setInterval(this.decClock, 1000);
  }
  render() {
    return (
      <div>
        <div className="card-header text-center">
          <h1 id='main-title'>Pomodoro Clock</h1>
        </div>
        <div className="mt-2 card-deck d-flex justify-content-around">
          <div className="col-sm-6">
            <SetBreak break={this.state.break} setBreak={this.setBreak} />
          </div>
          <div className="col-sm-6">
            <SetSession session={this.state.session} setSess={this.setSess} />
          </div>
        </div>
        <div className="card-body">
          <Timer
            stage={this.state.stage}
            mins={this.state.mins_remain}
            secs={this.state.secs_remain}
            play={this.togglePlay}
            reset={this.resetClock}
          />
          <audio
            id="beep"
            src="https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/Alarm%20Sounds/234[kb]ding_dong.aif.mp3"
          ></audio>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <div className="card border-info">
    <Pomodoro />
  </div>, 
  document.getElementById('root')
);
