import React from 'react';
import { signIn } from './actions';

export default class SocialButton extends React.Component {
  render() {
    const { name, disabled, tabIndex } = this.props;
    const colors = {
      facebook: "#4761b0",
      github: "#666666",
      google: "#df4a32"
    };
    const color = colors[name] || colors["github"];

    return (
      <button onClick={::this.handleClick} className="auth0-lock-social-button" style={{backgroundColor: color}} disabled={disabled} tabIndex={tabIndex} type="button">
        <div className="auth0-lock-social-button-icon" />
        <div className="auth0-lock-social-button-text">Login with {name}</div>
      </button>
    );
  }

  handleClick() {
    const { lockID, name } = this.props;
    signIn(lockID, name);
  }
}

SocialButton.propTypes = {
  lockID: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  tabIndex: React.PropTypes.number
};

SocialButton.defaultProps = {
  disabled: false,
  tabIndex: 1
};
