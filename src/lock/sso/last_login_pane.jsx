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
    const { lock, skipLastLoginLabel, tabIndex } = this.props;

    return (
      <div className="auth0-lock-last-login-pane">
        <LastLoginButton lock={lock} tabIndex={tabIndex} />

        <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href="#"
            onClick={::this.handleClick}
            tabIndex={l.tabIndex(lock, tabIndex)}
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
  skipLastLoginLabel: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number
};

LastLoginPane.defaultProps = {
  tabIndex: 1
};
