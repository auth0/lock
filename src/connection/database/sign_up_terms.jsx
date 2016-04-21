import React from 'react';

const SignUpTerms = ({checkHandler, children, value}) => {
  return checkHandler
    ? <span className="auth0-lock-sign-up-terms-agreement">
        <label>
          <input type="checkbox" onChange={checkHandler} value={value} />
          {children}
        </label>
      </span>
    : children;
};

export default SignUpTerms;
