import React from 'react';

export default class InputWrap extends React.Component {
  render() {
    var className = "auth0-lock-input-wrap auth0-lock-input-" + this.props.name;
    if (!this.props.isValid) {
      className += " auth0-lock-input-invalid";
    }

    return (
      <div className={className}>
        <i className="auth0-lock-icon"/>
        {this.props.children}
      </div>
    );
  }
}

InputWrap.propTypes = {
  name: React.PropTypes.string.isRequired,
  isValid: React.PropTypes.bool.isRequired,
  children: React.PropTypes.element.isRequired
};
