import React from 'react';
import * as l from '../../lock/index';
import { signIn } from '../../social/actions';
import { useBigButtons } from '../../social/index';

export default class SocialButton extends React.Component {
  render() {
    const { connection, disabled, lock, tabIndex } = this.props;
    const colors = {
      "facebook": "#4761b0",
      "github": "#666666",
      "google-oauth2": "#df4a32",
      "twitter": "#46c0fb",
      "windowslive": "#0078d5"
    };
    const color = colors[connection.strategy] || colors["github"];

    let className = "auth0-lock-social-button";
    if (useBigButtons(lock)) className += " auth0-lock-social-big-button";

    return (
      <button
        className={className}
        disabled={disabled}
        onClick={::this.handleClick}
        style={{backgroundColor: color}}
        tabIndex={tabIndex}
        type="button"
      >
        <div className="auth0-lock-social-button-icon" />
        <div className="auth0-lock-social-button-text">Login with {connection.name}</div>
      </button>
    );
  }

  handleClick() {
    const { lock, connection } = this.props;
    signIn(l.id(lock), connection.name);
  }
}

SocialButton.propTypes = {
  lock: React.PropTypes.object.isRequired,
  connection: React.PropTypes.object.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  tabIndex: React.PropTypes.number
};

SocialButton.defaultProps = {
  disabled: false,
  tabIndex: 1
};
