import React from 'react';

export default class Background extends React.Component {
  render() {
    let bgInnerAttrs = {className: 'auth0-lock-header-bg-inner'};
    if (this.props.imageUrl) {
      bgInnerAttrs.className += ' auth0-lock-no-grayscale';
      bgInnerAttrs.style = {backgroundImage: `url(${this.props.imageUrl})`};
    }

    return (
      <div className="auth0-lock-header-bg">
        <div {...bgInnerAttrs} />
      </div>
    );
  }
}

Background.propTypes = {
  imageUrl: React.PropTypes.string
}
