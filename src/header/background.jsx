import React from 'react';
import { isSmallScreen } from '../utils/media_utils';

const cssBlurSupport = (function() {
  // Check stolen from Modernizr, see https://github.com/Modernizr/Modernizr/blob/29eab707f7a2fb261c8a9c538370e97eb1f86e25/feature-detects/css/filters.js
  const el = global.document.createElement('div');
  el.style.cssText = "filter: blur(2px); -webkit-filter: blur(2px)";
  return !!el.style.length && (global.document.documentMode === undefined || global.document.documentMode > 9);
})();

export default class Background extends React.Component {
  render() {
    const { backgroundColor, imageUrl, grayScale } = this.props;

    const props = {
      className: "auth0-lock-header-bg"
    };

    if (cssBlurSupport) {
      props.className += " auth0-lock-blur-support";
    }

    const blurProps = {
      className: 'auth0-lock-header-bg-blur',
      style: {backgroundImage: `url('${imageUrl}')`}
    };

    if (grayScale) {
      blurProps.className += ' auth0-lock-no-grayscale';
    }

    const solidProps = {
      className: "auth0-lock-header-bg-solid",
      style: {backgroundColor: backgroundColor}
    }

    return (
      <div {...props}>
        <div {...blurProps} />
        <div {...solidProps} />
      </div>
    );
  }
}

Background.propTypes = {
  backgorundColor: React.PropTypes.string,
  grayScale: React.PropTypes.bool,
  imageUrl: React.PropTypes.string
}
