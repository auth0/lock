import React from 'react';

export default class Terms extends React.Component {
  render() {
    return <small className="auth0-lock-terms">{this.props.children}</small>;
  }
}
