import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { focused, isValid, name, svg } = this.props;
    let blockClassName = `auth0-lock-input-block auth0-lock-input-${name}`;
    if (!isValid) {
      blockClassName += " auth0-lock-error animated pulse";
    }

    let wrapClassName = "auth0-lock-input-wrap";
    if (focused && isValid) {
      wrapClassName += " auth0-lock-focused";
    }

    return (
      <div className={blockClassName}>
        <div className={wrapClassName}>
          <span dangerouslySetInnerHTML={{__html: svg}} />
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
  svg: React.PropTypes.string.isRequired
};
