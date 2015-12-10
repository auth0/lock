import React from 'react';
import { showLoginActivity, showSignUpActivity } from './actions';
import * as l from '../lock/index';
import { getActivity } from './index';

export default class LoginSignUpTabs extends React.Component {

  render() {
    const { lock } = this.props;
    const isLogin = getActivity(lock) === "login";

    return (
      <ul className="auth0-lock-tabs">
        <LoginSignUpTab
          label="Login"
          current={isLogin}
          clickHandler={::this.handleLoginClick}
        />
        <LoginSignUpTab
          label="Sign Up"
          current={!isLogin}
          clickHandler={::this.handleSignUpClick}
        />
      </ul>
    );
  }

  handleLoginClick() {
    showLoginActivity(l.id(this.props.lock));
  }

  handleSignUpClick() {
    showSignUpActivity(l.id(this.props.lock));
  }

}

class LoginSignUpTab extends React.Component {

  render() {
    const { clickHandler, current, label } = this.props;
    const className = current ? "auth0-lock-tabs-current" : "";

    return <li className={className}><a onClick={clickHandler}>{label}</a></li>;
  }

}
