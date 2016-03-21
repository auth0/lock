import React from 'react';
import * as l from '../../lock/index';
import { signIn } from '../../social/actions';
import { useBigButtons } from '../../social/index';

export default class SocialButton extends React.Component {

  render() {
    const { children, connection, disabled, lock } = this.props;

    let className = "auth0-lock-social-button";
    if (useBigButtons(lock)) className += " auth0-lock-social-big-button";

    return (
      <button
        className={className}
        data-provider={connection.strategy}
        disabled={disabled}
        onClick={::this.handleClick}
        type="button"
      >
        <div className="auth0-lock-social-button-icon" />
        <div className="auth0-lock-social-button-text">
          {children}
        </div>
      </button>
    );
  }

  handleClick() {
    const { lock, connection } = this.props;
    signIn(l.id(lock), connection);
  }

}

SocialButton.propTypes = {
  children: React.PropTypes.any.isRequired, // it would normally be a string or an array of strings
  connection: React.PropTypes.object.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  lock: React.PropTypes.object.isRequired
};

SocialButton.defaultProps = {
  disabled: false
};
