import React from 'react';

export default class Background extends React.Component {
  render() {
    const { imageUrl, grayScale } = this.props;
    let bgInnerAttrs = {
      className: 'auth0-lock-header-bg-inner',
      style: {backgroundImage: `url('${imageUrl}')`}
    };

    if (grayScale) {
      bgInnerAttrs.className += ' auth0-lock-no-grayscale';
    }

    return (
      <div className="auth0-lock-header-bg">
        <div {...bgInnerAttrs} />
      </div>
    );
  }
}

Background.propTypes = {
  imageUrl: React.PropTypes.string,
  grayScale: React.PropTypes.bool
}
