import React from 'react';

export default class SubmitButton extends React.Component {
  render() {
    var className, icon;
    if (this.props.active) {
      className = "auth0-lock-submit auth0-lock-submit-active";
      // TODO replace for a proper spinner
      icon = "I should be a spinner!";
    } else {
      className = "auth0-lock-submit";
      icon = <i className="auth0-lock-icon"/>;
    }

    return <button type="submit" className={className}>{icon}</button>;
  }
}

SubmitButton.propTypes = {
  active: React.PropTypes.bool
};
