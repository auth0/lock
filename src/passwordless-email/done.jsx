import React from 'react';

export default class Done extends React.Component {
  render() {
    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          We sent you a link to sign in. <br/>
          Please check your inbox.
        </div>
      </div>
    );
  }
}
