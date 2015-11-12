import React from 'react';
import * as l from '../../lock/index';
import { signIn } from '../../social/actions';
import { useBigButtons } from '../../social/index';

export default class SocialButton extends React.Component {
  render() {
    const { disabled, lock, name, tabIndex } = this.props;
    const colors = {
      facebook: "#4761b0",
      github: "#666666",
      google: "#df4a32",
      twitter: "#46c0fb",
      windows: "#0078d5"
    };
    const color = colors[name] || colors["github"];

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
        <div className="auth0-lock-social-button-text">Login with {name}</div>
      </button>
    );
  }

  handleClick() {
    const { lock, name } = this.props;
    signIn(l.id(lock), name);
  }
}

SocialButton.propTypes = {
  lock: React.PropTypes.object.isRequired,
  name: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  tabIndex: React.PropTypes.number
};

SocialButton.defaultProps = {
  disabled: false,
  tabIndex: 1
};
