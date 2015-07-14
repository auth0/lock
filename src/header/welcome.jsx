import React from 'react';
import Avatar from '../lock/avatar';

export default class Welcome extends React.Component {
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

    var name = this.props.gravatarData && this.props.gravatarData.get("displayName");
    var welcome;
    if (name) {
      name = "Welcome " + name + "!";
      welcome = <div className="auth0-lock-firstname">{name}</div>;
    } else {
      welcome = <div className="auth0-lock-name">Auth0</div>;
    }

    return (
      <div className="auth0-lock-header-welcome">
        {icon}
        {welcome}
      </div>
    )
  }
}

Welcome.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.bool,
  gravatarData: React.PropTypes.object,
  icon: React.PropTypes.string
};
