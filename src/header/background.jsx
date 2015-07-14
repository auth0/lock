import React from 'react';

export default class Background extends React.Component {
  render() {
    let bgInnerAttrs = {className: 'auth0-lock-header-bg-inner'};
    if (this.props.gravatar) {
      bgInnerAttrs.className += ' auth0-lock-no-grayscale';
      bgInnerAttrs.style = {backgroundImage: 'url(img/avatar.png)'};
    }

    return (
      <div className="auth0-lock-header-bg">
        <div {...bgInnerAttrs} />
      </div>
    );
  }
}

Background.propTypes = {
  gravatar: React.PropTypes.string
}
