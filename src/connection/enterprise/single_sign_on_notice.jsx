import React from 'react';
import { IconSvg } from '../../ui/input/password_input';

export default ({ children }) => (
  <div className="auth0-sso-notice-container">
    <span>{IconSvg}</span> <span className="auth0-sso-notice">{children}</span>
  </div>
);
