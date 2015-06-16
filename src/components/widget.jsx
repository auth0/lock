import React from 'react';

export default class Widget extends React.Component {
  // TODO extract components (header, tabs, inputs and so on)
  render() {
    return (
      <form className="auth0-lock-widget">
        <div className="auth0-lock-header">
          <a href="#" className="auth0-lock-close auth0-lock-icon"/>
          <div className="auth0-lock-header-avatar"/>
          <div className="auth0-lock-header-welcome">
            <div className="auth0-lock-header-logo"/>
            Auth0
          </div>
          <div className="auth0-lock-header-logo-blurry"/>
        </div>

        <div className="auth0-lock-content">
          <ul className="auth0-lock-tabs">
            <li className="auth0-lock-tabs-current"><a className="" href="">Login</a></li>
            <li><a className="" href="">Sign Up</a></li>
          </ul>

          <div className="auth0-lock-input-wrap auth0-lock-input-username">
            <i className="auth0-lock-icon"/>
            <input type="text" name="name" className="auth0-lock-input" placeholder="Username"/>
          </div>

          <div className="auth0-lock-input-wrap auth0-lock-input-password">
            <i className="auth0-lock-icon"/>
            <input type="password" name="password" className="auth0-lock-input" placeholder="Password"/>
          </div>

          <a href="#" className="auth0-lock-forgot-link">Don't remember your password?</a>
        </div>

        <button type="submit" className="auth0-lock-submit">
          <i className="auth0-lock-icon"/>
        </button>
      </form>
    );
  }
}
