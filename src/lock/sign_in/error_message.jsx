import React from 'react';

export default class SignInErrorMessage extends React.Component {
  render() {
    if (this.props.error) {
      return (
        <div className="auth0-lock-error-message fade-in">
          {this.props.error.get("description")}
        </div>
      );
    } else {
      return null;
    }
  }
}

SignInErrorMessage.propTypes = {
  error: React.PropTypes.object
};
