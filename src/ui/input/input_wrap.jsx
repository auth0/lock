import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { before, focused, invalidHint, isValid, name, icon } = this.props;
    let blockClassName = `auth0-lock-input-block auth0-lock-input-${name}`;
    if (!isValid) {
      blockClassName += " auth0-lock-error";
    }

    let wrapClassName = "auth0-lock-input-wrap";
    if (focused && isValid) {
      wrapClassName += " auth0-lock-focused";
    }

    // NOTE: Ugly hack until we upgrade to React 15 which has better
    // support for SVG.
    let iconElement = null;

    if (typeof icon === "string") {
      iconElement = <span dangerouslySetInnerHTML={{__html: icon}} />;
    } else if (icon) {
      iconElement = icon;
    }

    if (iconElement) {
      wrapClassName += " auth0-lock-input-wrap-with-icon";
    }

    const errorTooltip = !isValid && invalidHint
      ? <div className="auth0-lock-error-msg"><span>{invalidHint}</span></div>
      : null;

    return (
      <div className={blockClassName}>
        {before}
        <div className={wrapClassName}>
          {iconElement}
          {this.props.children}
        </div>
        {errorTooltip}
      </div>
    );
  }
}

InputWrap.propTypes = {
  before: React.PropTypes.element,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element.isRequired,
    React.PropTypes.arrayOf(React.PropTypes.element).isRequired
  ]),
  focused: React.PropTypes.bool,
  invalidHint: React.PropTypes.string,
  isValid: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  svg: React.PropTypes.string
};
