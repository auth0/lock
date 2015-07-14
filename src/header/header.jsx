import React from 'react';
import Avatar from '../lock/avatar';
import CloseButton from './close_button';


export default class Header extends React.Component {

  render() {
    var icon = <img className="auth0-lock-header-logo" src="img/badge.svg"/>;
    if (this.props.gravatar) {
      icon = <Avatar email={this.props.email} gravatar={this.props.gravatarData}/>;
    } else if (this.props.icon) {
      icon = (
        <div className="auth0-lock-header-logo-custom">
          <img src={this.props.icon}/>
        </div>
      );
    }

    let gravatarShowing = this.props.gravatarData;

    var name = this.props.gravatarData && this.props.gravatarData.get("displayName");
    var welcome;
    if (name) {
      name = "Welcome " + name + "!";
      welcome = <div className="auth0-lock-firstname">{name}</div>;
    } else {
      welcome = <div className="auth0-lock-name">Auth0</div>;
    }

    let bgInnerAttrs = {className: 'auth0-lock-header-bg-inner'};
    if (gravatarShowing) {
      bgInnerAttrs.className += ' auth0-lock-no-grayscale';
      bgInnerAttrs.style = {backgroundImage: 'url(img/avatar.png)'};
    }

    return (
      <div className="auth0-lock-header">
        <div className="auth0-lock-header-bg">
          <div {...bgInnerAttrs} />
        </div>

        {this.props.showCloseButton ? <CloseButton lockID={this.props.lockID}/> : null}

        <div className="auth0-lock-header-welcome">
          {icon}
          {welcome}
        </div>
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
