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
    return (
      <div>
        <LastLoginButton lock={this.props.lock} />

        <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            onClick={::this.handleClick}
          >
            Not your account?
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
  lock: React.PropTypes.object.isRequired
};
