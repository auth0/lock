import React from 'react';
import Content from './content';

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

        <Content lock={this.props.lock}/>

        {/* TODO hide the button when loading */}
        <button type="submit" className="auth0-lock-submit">
          <i className="auth0-lock-icon"/>
        </button>
      </form>
    );
  }
}
