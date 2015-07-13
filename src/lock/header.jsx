import React from 'react';
import Avatar from './avatar';
import LockActionCreators from './action_creators';

export default class Header extends React.Component {
  _handleClose(event) {
    event.preventDefault();
    LockActionCreators.hideLock(this.props.lockID);
  }

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

    var closeButton = null;
    if (this.props.showCloseButton) {
      let svgTag = '<svg enable-background="new 0 0 128 128" height="128px" class="auth0-lock-close" id="Слой_1" version="1.1" viewBox="0 0 128 128" width="128px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><polygon fill="#373737" points="123.5429688,11.59375 116.4765625,4.5185547 64.0019531,56.9306641 11.5595703,4.4882813     4.4882813,11.5595703 56.9272461,63.9970703 4.4570313,116.4052734 11.5244141,123.4814453 63.9985352,71.0683594     116.4423828,123.5117188 123.5126953,116.4414063 71.0732422,64.0019531   "/></g></svg>';
      closeButton = <span dangerouslySetInnerHTML={{__html: svgTag}} />;
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

        {closeButton}

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
