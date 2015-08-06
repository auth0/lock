import React from 'react';
import Immutable from 'immutable';
import Auth0Lock from '../lock/auth0_lock';
import webAPI from '../lock/web_api';
import { subscribe, swap } from '../store/index';

const METHODS = {
  emailcode: {
    signIn: true,
    startPasswordless: true
  },
  magiclink: {
    signIn: false,
    startPasswordless: true
  },
  sms: {
    signIn: true,
    startPasswordless: true
  }
};

export default class Control extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lock: new Auth0Lock("", ""),
      method: "sms",
      startPasswordlessOptions: {
        result: "success",
        delay: 3000
      },
      signInOptions: {
        result: "success",
        delay: 3000
      },
      uiOptions: {
        icon: "",
        gravatar: true
      }
    };
  }

  componentDidMount() {
    webAPI.setStartPasswordlessResult(this.state.startPasswordlessOptions.result);
    webAPI.setStartPasswordlessDelay(this.state.startPasswordlessOptions.delay);
    webAPI.setSignInResult(this.state.signInOptions.result);
    webAPI.setSignInDelay(this.state.signInOptions.delay);
  }

  render() {
    const { method, startPasswordlessOptions, signInOptions, uiOptions } = this.state;
    const methodSpec = METHODS[method];

    return (
      <div>
        <MethodSelect selected={method} onChange={::this.handleMethodChange} />
        <UIOptions options={uiOptions} onChange={::this.handleUIOptionsChange} />
        {methodSpec.startPasswordless && <StartPasswordlessOptions options={startPasswordlessOptions} onChange={::this.handleStartPasswordlessOptionsChange} />}
        {methodSpec.signIn && <SignInOptions options={signInOptions} onChange={::this.handleSignInOptionsChange} />}

        <br/><OpenButton onClick={::this.handleOpen} />
        <Snapshot />
      </div>
    );
  }

  handleMethodChange(method) {
    let lock = this.state.lock;
    if (this.state.method != method) {
      lock = new Auth0Lock("", "");
    }
    this.setState({method: method, lock: lock});
  }

  handleUIOptionsChange(options) {
    this.setState({uiOptions: options});
  }

  handleStartPasswordlessOptionsChange(options) {
    webAPI.setStartPasswordlessResult(options.result);
    webAPI.setStartPasswordlessDelay(options.delay);
    this.setState({startPasswordlessOptions: options});
  }

  handleSignInOptionsChange(options) {
    webAPI.setSignInResult(options.result);
    webAPI.setSignInDelay(options.delay);
    this.setState({signInOptions: options});
  }

  handleOpen(e) {
    e.preventDefault();
    const { lock, method, uiOptions } = this.state;
    this.state.lock[method](uiOptions, () => {});
  }
}

class MethodSelect extends React.Component {
  render() {
    const { selected } = this.props;
    const options = Object.keys(METHODS).map(x => {
      return <option key={x} value={x}>{x}</option>;
    });

    return (
      <div>
        Method: { }
        <select onChange={::this.handleChange} value={selected}>{options}</select>
      </div>
    );
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(e.target.value);
  }
}

class OpenButton extends React.Component {
  render() {
    const { onClick } = this.props;
    return <button onClick={onClick}>Open</button>;
  }
}

class CallbackResultSelect extends React.Component {
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

class CallbackDelayInput extends React.Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        Response delay: { }
        <input type="number" onChange={::this.handleChange} value={value} />
      </div>
    );
  }

  handleChange(e) {
    e.preventDefault();
    const delay = parseInt(e.target.value, 10);
    if (delay.toString() === e.target.value) {
      this.props.onChange(delay);
    }
  }
}

class StartPasswordlessOptions extends React.Component {
  render() {
    const { options } = this.props;

    return (
      <div>
        <h3>startPasswordless</h3>
        <CallbackResultSelect selected={options.result} onChange={::this.handleCallbackResultChange} />
        <CallbackDelayInput value={options.delay} onChange={::this.handleCallbackDelayChange} />
      </div>
    );

  }

  handleCallbackResultChange(value) {
    const { options, onChange } = this.props;
    onChange({result: value, delay: options.delay});
  }

  handleCallbackDelayChange(value) {
    const { options, onChange } = this.props;
    onChange({result: options.result, delay: value});
  }
}

class SignInOptions extends React.Component {
  render() {
    const { options } = this.props;

    return (
      <div>
        <h3>singIn</h3>
        <CallbackResultSelect selected={options.result} onChange={::this.handleCallbackResultChange} />
        <CallbackDelayInput value={options.delay} onChange={::this.handleCallbackDelayChange} />
      </div>
    );

  }

  handleCallbackResultChange(value) {
    const { options, onChange } = this.props;
    onChange({result: value, delay: options.delay});
  }

  handleCallbackDelayChange(value) {
    const { options, onChange } = this.props;
    onChange({result: options.result, delay: value});
  }
}

class IconInput extends React.Component {
  render() {
    return (
      <div>
        Icon: { }
        <input type="text" value={this.props.value} onChange={::this.handleChange} />
      </div>
    );
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(e.target.value);
  }
}

class BooleanSelect extends React.Component {
  render() {
    const options = ["true", "false"].map(x => {
      return <option key={x} value={x}>{x}</option>;
    });
    return <select value={this.props.value} onChange={::this.handleChange}>{options}</select>;
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onChange(e.target.value == "true");
  }
}

class GravatarSelect extends React.Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        Gravatar: { }
        <BooleanSelect value={value} onChange={onChange} />
      </div>
    );
  }
}

class UIOptions extends React.Component {
  render() {
    const { options } = this.props;

    return (
      <div>
        <h3>UI</h3>
        <IconInput value={options.icon} onChange={::this.handleIconChange} />
        <GravatarSelect value={options.gravatar} onChange={::this.handleGravatarChange} />
      </div>
    );
  }

  handleIconChange(icon) {
    const { options } = this.props;
    this.props.onChange({icon: icon, gravatar: options.gravatar});
  }

  handleGravatarChange(gravatar) {
    const { options } = this.props;
    this.props.onChange({icon: options.icon, gravatar: gravatar});
  }
}

class Snapshot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {snapshot: ""};
  }

  componentDidMount() {
    subscribe("design-tools", (key, oldState, newState) => {
      if (newState) {
        this.setState({snapshot: global.JSON.stringify(newState.toJS())});
      }
    });
  }

  render() {
    return (
      <div>
        <h3>Snapshot</h3>
        State: { }
        <input type="text" value={this.state.snapshot} />
      </div>
    );
  }
}

global.window.loadSnapshot = function(str) {
  swap(_ => Immutable.fromJS(global.JSON.parse(str)));
}
