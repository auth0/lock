import React from 'react';
import Background from './background';
import CloseButton from './close_button';
import Welcome from './welcome';


export default class Header extends React.Component {

  render() {
    const imageUrl = this.props.gravatarData && this.props.gravatarData.get("imageUrl");

    return (
      <div className="auth0-lock-header">
        <Background imageUrl={imageUrl} />
        {this.props.showCloseButton ? <CloseButton lockID={this.props.lockID}/> : null}
        <Welcome gravatar={this.props.gravatar} email={this.props.email} icon={this.props.icon} gravatarData={this.props.gravatarData}/>
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
