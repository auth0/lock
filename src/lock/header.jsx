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
      icon = <Avatar email={this.props.email} gravatar={this.props.gravatarData}/>;
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

    var name = this.props.email && this.props.gravatarData && this.props.gravatarData.get("email") === this.props.email && this.props.gravatarData.get("name");
    var welcome;
    if (name) {
      name = "Welcome " + name + "!";
      welcome = <div className="auth0-lock-firstname">{name}</div>;
    } else {
      welcome = <div className="auth0-lock-name">Auth0</div>;
    }

    return (
      <div className="auth0-lock-header">
        <div className="auth0-lock-header-bg"/>
        {closeButton}

        <div className="auth0-lock-header-welcome">
          {icon}
          {welcome}
        </div>
        {/* <div className="auth0-lock-header-logo-blurry"/> */}
      </div>
    );
  }
}

Header.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.bool,
  gravatarData: React.PropTypes.object,
  icon: React.PropTypes.string,
  lockID: React.PropTypes.string,
  showCloseButton: React.PropTypes.bool

};
