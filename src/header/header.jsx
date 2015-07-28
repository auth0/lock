import React from 'react';
import Background from './background';
import Welcome from './welcome';


export default class Header extends React.Component {

  render() {
    const imageUrl = this.props.gravatar && this.props.gravatar.get("imageUrl");

    return (
      <div className="auth0-lock-header">
        <Background imageUrl={imageUrl} />
        <Welcome gravatar={this.props.gravatar} icon={this.props.icon}/>
      </div>
    );
  }
}

Header.propTypes = {
  email: React.PropTypes.string,
  gravatar: React.PropTypes.object,
  icon: React.PropTypes.string
};
