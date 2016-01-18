import React from 'react';
import { showLoginActivity, showSignUpActivity } from './actions';
import * as l from '../lock/index';
import { getActivity } from './index';

export default class LoginSignUpTabs extends React.Component {

  render() {
    const { lock, tabIndex } = this.props;
    const isLogin = getActivity(lock) === "login";

    return (
      <ul className="auth0-lock-tabs">
        <LoginSignUpTab
          label="Login"
          current={isLogin}
          clickHandler={::this.handleLoginClick}
          tabIndex={l.tabIndex(lock, tabIndex)}
        />
        <LoginSignUpTab
          label="Sign Up"
          current={!isLogin}
          clickHandler={::this.handleSignUpClick}
          tabIndex={l.tabIndex(lock, tabIndex)}
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

LoginSignUpTabs.propTypes = {
  lock: React.PropTypes.object.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};

LoginSignUpTabs.defaultProps = {
  tabIndex: 1
};

class LoginSignUpTab extends React.Component {

  handleClick(e) {
    e.preventDefault();
    this.props.clickHandler();
  }

  render() {
    const { current, label, tabIndex } = this.props;
    const className = current ? "auth0-lock-tabs-current" : "";

    return (
      <li className={className}>
        <a href="#" onClick={::this.handleClick} tabIndex={tabIndex}>{label}</a>
      </li>
    );
  }

}
