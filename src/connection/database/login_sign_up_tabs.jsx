import PropTypes from 'prop-types';
import React from 'react';
import { showLoginActivity, showSignUpActivity } from './actions';
import * as l from '../../core/index';
import { getScreen } from './index';
import { closeLock } from '../../core/actions';

export default class LoginSignUpTabs extends React.Component {
  render() {
    const { lock, loginLabel, signUpLink, signUpLabel } = this.props;
    const isLogin = getScreen(lock) === 'login';

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
            clickWithHrefHandler={::this.handleSignUpWithHrefClick}
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
    if (this.props.signUpLink) {
      closeLock(l.id(this.props.lock), true);
    }
    showSignUpActivity(l.id(this.props.lock));
  }

  handleSignUpWithHrefClick() {
    closeLock(l.id(this.props.lock), true);
  }
}

LoginSignUpTabs.propTypes = {
  lock: PropTypes.object.isRequired,
  loginLabel: PropTypes.string.isRequired,
  signUpLabel: PropTypes.string.isRequired,
  signUpLink: PropTypes.string
};

class LoginSignUpTab extends React.Component {
  handleClick(e) {
    if (this.props.href) {
      this.props.clickWithHrefHandler();
    } else {
      e.preventDefault();
      this.props.clickHandler();
    }
  }

  render() {
    const { current, href, label } = this.props;
    const className = current ? 'auth0-lock-tabs-current' : '';

    return (
      <li className={className}>
        <a href={href || '#'} onClick={::this.handleClick}>
          {label}
        </a>
      </li>
    );
  }
}
