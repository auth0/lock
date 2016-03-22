import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { focused, isValid, name, icon } = this.props;
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

    return (
      <div className={blockClassName}>
        <div className={wrapClassName}>
          {iconElement}
          {this.props.children}
        </div>
      </div>
    );
  }
}

InputWrap.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element.isRequired,
    React.PropTypes.arrayOf(React.PropTypes.element).isRequired
  ]),
  focused: React.PropTypes.bool,
  isValid: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  svg: React.PropTypes.string
};
