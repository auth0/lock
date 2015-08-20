import React from 'react';

export default class Icon extends React.Component {
  render() {
    const { imageUrl } = this.props;
    return <img className="auth0-lock-header-logo" src={imageUrl} />;
  }
}

Icon.propTyes = {
  imageUrl: React.PropTypes.string
};
