import React from 'react';
import Avatar from './avatar';

export default class Header extends React.Component {
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
      closeButton = <a href="#" className="auth0-lock-close auth0-lock-icon"/>;
    }

    return (
      <div className="auth0-lock-header">
        {closeButton}
        {/*<div className="auth0-lock-header-avatar"/>*/}
        <div className="auth0-lock-header-welcome">
          {icon}
          {/* TODO instead of 'Auth0' we should be displaying 'sign in' and so on */}
          Auth0
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
  showCloseButton: React.PropTypes.bool
};
