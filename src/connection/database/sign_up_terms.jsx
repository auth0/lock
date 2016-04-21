import React from 'react';

const SignUpTerms = ({checkHandler, children, checkLabel, value}) => {
  const check = checkLabel
    ? <p className="auth0-lock-sign-up-terms-agreement">
        <label>
          <input type="checkbox" onChange={checkHandler} value={value} />
          {checkLabel}
        </label>
      </p>
    : null;
  return <span>{children}{check}</span>;
};

export default SignUpTerms;
