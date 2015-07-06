import React from 'react';

export default class Avatar extends React.Component {
  render() {
    var placeholder = <img className="auth0-lock-header-logo" src="img/badge.svg"/>;
    var gravatar = <img className="auth0-lock-header-avatar animated fadeInDown" src={this.props.gravatar && this.props.gravatar.get("url")}/>;
    return this.props.email && this.props.gravatar && this.props.gravatar.get("email") === this.props.email ? gravatar : placeholder;
  }
}

Avatar.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.object
};
