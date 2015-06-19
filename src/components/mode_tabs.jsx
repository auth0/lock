import React from 'react';

export default class ModeTabs extends React.Component {
  _handleTab(event) {
    event.preventDefault();
    alert('not implemented');
  }

  render() {
    return (
      <ul className="auth0-lock-tabs">
        <li className="auth0-lock-tabs-current"><a className="" href="" onClick={this._handleTab}>Login</a></li>
        <li><a className="" href="" onClick={this._handleTab}>Sign Up</a></li>
      </ul>
    );
  }
}
