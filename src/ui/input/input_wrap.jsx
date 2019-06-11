import PropTypes from 'prop-types';
import React from 'react';

export default class InputWrap extends React.Component {
  render() {
    const { after, focused, invalidHint, isValid, name, icon } = this.props;
    let blockClassName = `auth0-lock-input-block auth0-lock-input-${name}`;
    if (!isValid) {
      blockClassName += ' auth0-lock-error';
    }

    let wrapClassName = 'auth0-lock-input-wrap';
    if (focused && isValid) {
      wrapClassName += ' auth0-lock-focused';
    }

    // NOTE: Ugly hack until we upgrade to React 15 which has better
    // support for SVG.
    let iconElement = null;

    if (typeof icon === 'string') {
      iconElement = <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} />;
    } else if (icon) {
      iconElement = icon;
    }

    if (iconElement) {
      wrapClassName += ' auth0-lock-input-wrap-with-icon';
    }

    const errorTooltip =
      !isValid && invalidHint ? (
        <div role="alert" id={`auth0-lock-error-msg-${name}`} className="auth0-lock-error-msg">
          <div className="auth0-lock-error-invalid-hint">{invalidHint}</div>
        </div>
      ) : null;

    return (
      <div className={blockClassName}>
        <div className={wrapClassName}>
          {iconElement}
          {this.props.children}
        </div>
        {after}
        {errorTooltip}
      </div>
    );
  }
}

InputWrap.propTypes = {
  after: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired
  ]),
  focused: PropTypes.bool,
  invalidHint: PropTypes.node,
  isValid: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  svg: PropTypes.string
};
