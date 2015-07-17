import React from 'react';
import EmailInput from '../forms/email_input';


export default class PasswordlessEmailContent extends React.Component {
  render() {
    const { lock } = this.props;
    const isValid = !lock.get("validate") || lock.get("emailValid");
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          Enter your email address to sign in or create an account
        </div>

        <EmailInput value={lock.get("email")} isValid={isValid} />
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('handling submit');
  }

}

PasswordlessEmailContent.propTypes = {
  lock: React.PropTypes.object
};
