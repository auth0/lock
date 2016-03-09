import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { focused, icon, isValid } = this.props;
    let blockClassName = "auth0-lock-input-block auth0-lock-input-" + this.props.name;
    if (!isValid) {
      blockClassName += " auth0-lock-error animated pulse";
    }

    let wrapClassName = "auth0-lock-input-wrap";
    if (focused && isValid) {
      wrapClassName += " auth0-lock-focused";
    }

    const fallbackIcon = <i className="auth0-lock-icon"/>;

    return (
      <div className={blockClassName}>
        <div className={wrapClassName}>
          {icon || fallbackIcon}
          {this.props.children}
        </div>
      </div>
    );
  }
}

InputWrap.propTypes = {
  name: React.PropTypes.string.isRequired,
  isValid: React.PropTypes.bool.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element.isRequired,
    React.PropTypes.arrayOf(React.PropTypes.element).isRequired
  ])
};
