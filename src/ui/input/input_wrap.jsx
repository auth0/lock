import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { focused, isValid, name, svg } = this.props;
    let blockClassName = `auth0-lock-input-block auth0-lock-input-${name}`;
    if (!isValid) {
      blockClassName += " auth0-lock-error";
    }

    let wrapClassName = "auth0-lock-input-wrap";
    if (focused && isValid) {
      wrapClassName += " auth0-lock-focused";
    }

    const icon = svg
      ? <span dangerouslySetInnerHTML={{__html: svg}} />
      : null;

    if (icon) {
      wrapClassName += " auth0-lock-input-wrap-with-icon";
    }

    return (
      <div className={blockClassName}>
        <div className={wrapClassName}>
          {icon}
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
