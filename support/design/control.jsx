import React from 'react';
import Immutable from 'immutable';
import atom from '../../src/utils/atom';
import { getState, subscribe, swap, unsubscribe } from '../../src/store/index';

export const store = atom(Immutable.fromJS({
  latency: 2500,
  resetPassword: {response: "success"},
  logIn: {response: "success"},
  signUp: {response: "success"},
  startPasswordless: {response: "success"}
}));

export default class Control extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeypress = ::this.handleKeypress;
    this.state = store.deref().toJS();
    this.state.showing = false;
  }

  componentDidMount() {
    document.addEventListener("keypress", this.handleKeypress, false);
    store.addWatch("control", (key, oldState, newState) => this.setState(newState.toJS()));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeypress);
    store.removeWatch("control");
  }

  render() {
    if (!this.state.showing) return null;

    return (
      <div className="control">
      <div>
        <h3>startPasswordless</h3>
        <ResultSelect selected={this.state.startPasswordless.response}
            onChange={::this.handleStartPasswodlessResponseChange} />

        <h3>logIn</h3>
        <ResultSelect selected={this.state.logIn.response}
            onChange={::this.handleLogInResponseChange} />

        <h3>signUp</h3>
        <ResultSelect selected={this.state.signUp.response}
            onChange={::this.handleSignUpResponseChange} />

        <h3>resetPassword</h3>
        <ResultSelect selected={this.state.resetPassword.response}
            onChange={::this.handleResetPasswordResponseChange} />

        <h3>Latency</h3>
        <input type="number" onChange={::this.handleLatencyChange} value={this.state.latency}/>

      </div>
      <div><Snapshot /></div>
      <div><br />
        <a href="#" onClick={::this.handleCloseClick}>close</a>
      </div>
    </div>
    );
  }

  handleCloseClick(e) {
    e.preventDefault();
    this.setState({showing: false});
  }

  handleKeypress(e) {
    if (e.which === 63) {
      this.setState({showing: true});
    }
  }

  handleResetPasswordResponseChange(value) {
    store.swap(state => state.setIn(["resetPassword", "response"], value));
  }

  handleStartPasswodlessResponseChange(value) {
    store.swap(state => state.setIn(["startPasswordless", "response"], value));
  }

  handleLogInResponseChange(value) {
    store.swap(state => state.setIn(["logIn", "response"], value));
  }

  handleSignUpResponseChange(value) {
    store.swap(state => state.setIn(["signUp", "response"], value));
  }

  handleLatencyChange(e) {
    store.swap(state => state.set("latency", e.target.value));
  }

}

class ResultSelect extends React.Component {
  render() {
    const { selected, onChange } = this.props;
    const options = ["success", "error"].map(x => {
       return <option key={x} value={x}>{x}</option>;
    });

    return (
      <div>
        Response status: { }
        <select onChange={::this.handleChange} value={selected}>{options}</select>
      </div>
    );
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(e.target.value);
  }
}

class Snapshot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {snapshot: global.JSON.stringify(getState().toJS())};
  }

  componentDidMount() {
    subscribe("design-tools.snapshot", (key, oldState, newState) => {
      if (newState) {
        this.setState({snapshot: global.JSON.stringify(newState.toJS())});
      }
    });
  }

  componentWillUnmount() {
    unsubscribe("design-tools.snapshot");
  }

  render() {
    return (
      <div>
        <h3>Snapshot</h3>
        State: { }
        <textarea defaultValue={this.state.snapshot} />
      </div>
    );
  }
}

global.window.loadSnapshot = function(str) {
  swap(state => state.set("lock", Immutable.fromJS(global.JSON.parse(str).lock)));
}
