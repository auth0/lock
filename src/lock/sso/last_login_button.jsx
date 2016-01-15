import React from 'react';
import * as l from '../index';
import { signIn } from './actions';
import { lastUsedConnection, lastUsedUsername } from './index';

export default class LastLoginButton extends React.Component {

  handleClick(e) {
    e.preventDefault();
    const { lock } = this.props;
    signIn(l.id(lock), lastUsedConnection(lock));
  }

  render() {
    const { disabled, lock, tabIndex } = this.props;

    return (
      <button
        className="auth0-lock-social-button auth0-lock-social-big-button"
        data-provider={lastUsedConnection(lock).strategy}
        disabled={disabled}
        onClick={::this.handleClick}
        tabIndex={l.tabIndex(lock, tabIndex)}
        type="button"
      >
        <div className="auth0-lock-social-button-icon" />
        <div className="auth0-lock-social-button-text">
          {lastUsedUsername(lock)}
        </div>
      </button>
    );
  }

}

LastLoginButton.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  lock: React.PropTypes.object.isRequired,
  tabIndex: React.PropTypes.number
};

LastLoginButton.defaultProps = {
  disabled: false,
  tabIndex: 1
};
