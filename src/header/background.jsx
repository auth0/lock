import React from 'react';
import { isSmallScreen } from '../utils/media_utils';

export default class Background extends React.Component {
  render() {
    const { backgroundColor, imageUrl, grayScale } = this.props;
    let bgInnerAttrs = {
      className: 'auth0-lock-header-bg-inner',
      style: {backgroundImage: `url('${imageUrl}')`}
    };

    if (grayScale) {
      bgInnerAttrs.className += ' auth0-lock-no-grayscale';
    }

    const style = {};
    if (isSmallScreen()) {
      style.backgroundColor = backgroundColor;
    }

    return (
      <div className="auth0-lock-header-bg" style={style}>
        <div {...bgInnerAttrs} />
      </div>
    );
  }
}

Background.propTypes = {
  imageUrl: React.PropTypes.string,
  grayScale: React.PropTypes.bool
}
