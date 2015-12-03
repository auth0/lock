import React from 'react';
import Icon from '../icon/icon';

export default class Badge extends React.Component {
  render() {
    return (
      <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge">
        <Icon name="badge" />
      </a>
    );
  }
}
