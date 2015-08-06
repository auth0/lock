import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { icon } = this.props;
    var className = "auth0-lock-input-block auth0-lock-input-" + this.props.name;
    if (!this.props.isValid) {
      className += " auth0-lock-error animated pulse";
    }
    const fallbackIcon = <i className="auth0-lock-icon"/>;

    return (
      <div className={className}>
        <div className="auth0-lock-input-wrap">
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
  children: React.PropTypes.element.isRequired
};
