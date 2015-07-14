import React from 'react';
import Icon from './icon';
import WelcomeMessage from './welcome_message';

export default class Welcome extends React.Component {
  render() {
    let name, avatarUrl;
    if (this.props.gravatarData) {
      name = this.props.gravatarData.get("displayName");
      avatarUrl = this.props.gravatarData.get("imageUrl");
    }

    return (
      <div className="auth0-lock-header-welcome">
        <Icon avatarUrl={avatarUrl} logoUrl={this.props.icon} />
        <WelcomeMessage name={name}/>
      </div>
    );
  }
}

Welcome.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.bool,
  gravatarData: React.PropTypes.object,
  icon: React.PropTypes.string
};
