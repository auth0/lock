import React from 'react';
import Immutable from 'immutable';
import atom from '../atom/index';

export const store = atom(Immutable.fromJS({
  latency: 2500,
  signIn: {response: "success"},
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
        <ResultSelect selected={this.state.startPasswordless.result}
            onChange={::this.handleStartPasswodlessResultChange} />

        <h3>signIn</h3>
        <ResultSelect selected={this.state.signIn.result}
            onChange={::this.handleSignInResultChange} />
      </div>
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

  handleStartPasswodlessResultChange(value) {
    store.swap(state => state.setIn(["startPasswordless", "result"], value));
  }

  handleSignInResultChange(value) {
    store.swap(state => state.setIn(["signIn", "result"], value));
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

// class Snapshot extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {snapshot: ""};
//   }
//
//   componentDidMount() {
//     subscribe("design-tools", (key, oldState, newState) => {
//       if (newState) {
//         this.setState({snapshot: global.JSON.stringify(newState.toJS())});
//       }
//     });
//   }
//
//   render() {
//     return (
//       <div>
//         <h3>Snapshot</h3>
//         State: { }
//         <input type="text" value={this.state.snapshot} />
//       </div>
//     );
//   }
// }
//
// global.window.loadSnapshot = function(str) {
//   swap(_ => Immutable.fromJS(global.JSON.parse(str)));
// }
