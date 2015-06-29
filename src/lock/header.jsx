import React from 'react';
import Avatar from './avatar';
import LockActionCreators from './action_creators';

export default class Header extends React.Component {
  _handleClose(event) {
    event.preventDefault();
    LockActionCreators.hideLock(this.props.lockID);
  }

  render() {
    var icon = <div className="auth0-lock-header-logo"/>;
    if (this.props.gravatar) {
      icon = <Avatar email={this.props.email}/>;
    } else if (this.props.icon) {
      icon = (
        <div className="auth0-lock-header-logo-custom">
          <img src={this.props.icon}/>
        </div>
      );
    }

    var closeButton = null;
    if (this.props.showCloseButton) {
      closeButton = <a href="#" className="auth0-lock-close auth0-lock-icon" onClick={this._handleClose.bind(this)}/>;
    }

    return (
      <div className="auth0-lock-header">
        <div className="auth0-lock-header-bg"/>
        {closeButton}

        <div className="auth0-lock-header-welcome">
          {icon}
          {/* TODO instead of 'Auth0' we should be displaying 'sign in' and so on */}
          <div className="auth0-lock-name">Auth0</div>
          {/* TODO show a proper welcome message */}
          <div className="auth0-lock-firstname auth0-lock-hide">Welcome Ricardo!</div>
        </div>
        {/* <div className="auth0-lock-header-logo-blurry"/> */}
      </div>
    );
  }
}

Header.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.bool,
  icon: React.PropTypes.string,
  lockID: React.PropTypes.string,
  showCloseButton: React.PropTypes.bool

};
