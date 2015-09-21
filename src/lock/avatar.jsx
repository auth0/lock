import React from 'react';

export default class Avatar extends React.Component {
  render() {
    const { imageUrl } = this.props;
    return <img src={imageUrl} className="auth0-lock-header-avatar" />;
  }
}

Avatar.propTypes = {
  imageUrl: React.PropTypes.string
}
