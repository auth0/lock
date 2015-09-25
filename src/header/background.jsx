import React from 'react';
import { isSmallScreen } from '../utils/media_utils';

export default class Background extends React.Component {
  render() {
    const { backgroundColor, imageUrl, grayScale } = this.props;
    let bgInnerAttrs = {
      className: 'auth0-lock-header-bg-blur',
      style: {backgroundImage: `url('${imageUrl}')`}
    };

    if (grayScale) {
      bgInnerAttrs.className += ' auth0-lock-no-grayscale';
    }

    return (
      <div className="auth0-lock-header-bg">
        <div {...bgInnerAttrs} />
        <div className="auth0-lock-header-bg-solid" style={{backgroundColor: backgroundColor}} />
      </div>
    );
  }
}

Background.propTypes = {
  backgorundColor: React.PropTypes.string,
  grayScale: React.PropTypes.bool,
  imageUrl: React.PropTypes.string
}
