import React from 'react';
import { icon } from '../../ui/input/password_input';

export default ({ children }) => (
  <div className="auth0-sso-notice-container">
    <span dangerouslySetInnerHTML={{ __html: icon }} /> {' '}
    <span className="auth0-sso-notice">{children}</span>
  </div>
);
