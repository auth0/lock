import React from 'react';
import { showLoginActivity, showSignUpActivity } from './actions';
import * as l from '../../core/index';
import { getScreen } from './index';

export default class LoginSignUpTabs extends React.Component {

  render() {
    const {
      lock,
      loginLabel,
      signUpLink,
      signUpLabel
    } = this.props;
    const isLogin = getScreen(lock) === "login";

    return (
      <div className="auth0-lock-tabs-container">
        <ul className="auth0-lock-tabs">
          <LoginSignUpTab
            label={loginLabel}
            current={isLogin}
            clickHandler={::this.handleLoginClick}
          />
          <LoginSignUpTab
            label={signUpLabel}
            current={!isLogin}
            clickHandler={::this.handleSignUpClick}
            href={signUpLink}
          />
        </ul>
      </div>
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
  loginLabel: React.PropTypes.string.isRequired,
  signUpLabel: React.PropTypes.string.isRequired,
  signUpLink: React.PropTypes.string
};

class LoginSignUpTab extends React.Component {

  handleClick(e) {
    e.preventDefault();
    this.props.clickHandler();
  }

  render() {
    const { current, href, label } = this.props;
    const className = current ? "auth0-lock-tabs-current" : "";

    return (
      <li className={className}>
        <a
          href={href || "#"}
          onClick={href ? undefined : ::this.handleClick}
        >
          {label}
        </a>
      </li>
    );
  }

}
