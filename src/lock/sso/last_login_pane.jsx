import React from 'react';
import LastLoginButton from './last_login_button';
import { skipSSOLogin } from './actions';
import * as l from '../index';

export default class LastLoginPane extends React.Component {

  handleClick(e) {
    e.preventDefault();
    skipSSOLogin(l.id(this.props.lock));
  }

  render() {
    const { lock, skipLastLoginLabel } = this.props;

    return (
      <div className="auth0-lock-last-login-pane">
        <LastLoginButton lock={lock} />

        <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href="#"
            onClick={::this.handleClick}
          >
            {skipLastLoginLabel}
          </a>
        </p>

        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
      </div>
    );
  }

}

LastLoginPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  skipLastLoginLabel: React.PropTypes.string.isRequired
};
