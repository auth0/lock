import React from 'react';

export default class Icon extends React.Component {
  render() {
    const defaultLogoUrl = "img/badge.svg";
    let className, src;
    if (this.props.avatarUrl) {
      className = "auth0-lock-header-avatar animated fadeInDown";
      src = this.props.avatarUrl;
    } else {
      className = "auth0-lock-header-logo";
      src = this.props.logoUrl || defaultLogoUrl;
    }

    return <img className={className} src={src} />;
  }
}

Icon.propTyes = {
  avatarUrl: React.PropTypes.string,
  logoUrl: React.PropTypes.string
};
