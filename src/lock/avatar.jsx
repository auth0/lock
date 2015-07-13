import React from 'react';

export default class Avatar extends React.Component {
  render() {
    var placeholder = <img className="auth0-lock-header-logo" src="img/badge.svg"/>;
    var gravatar = <img className="auth0-lock-header-avatar animated fadeInDown" src={this.props.gravatar && this.props.gravatar.get("imageUrl")}/>;
    return this.props.gravatar ? gravatar : placeholder;
  }
}

Avatar.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.object
};
