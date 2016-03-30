import React from 'react';
import { skipSSOLogin } from '../../lock/sso/actions';
import * as l from '../../lock/index';

const KerberosButton = () => (
  <button
    className="auth0-lock-social-button auth0-lock-social-big-button"
    data-provider="windows"
    disabled={false}
    onClick={e => alert("not implemented")}
    type="button"
  >
    <div className="auth0-lock-social-button-icon" />
    <div className="auth0-lock-social-button-text">
      Windows Authentication
    </div>
  </button>
);

export default class KerberosPane extends React.Component {

  handleClick(e) {
    e.preventDefault();
    skipSSOLogin(l.id(this.props.lock));
  }

  render() {
    const { lock, skipLastLoginLabel } = this.props;

    return (
      <div className="auth0-lock-last-login-pane">
        <KerberosButton />

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

KerberosPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  skipLastLoginLabel: React.PropTypes.string.isRequired
};
