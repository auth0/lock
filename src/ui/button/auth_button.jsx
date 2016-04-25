import React from 'react';

const AuthButton = (props) => {
  const { disabled, isBig, label, onClick, strategy } = props;

  let className = "auth0-lock-social-button";
  if (isBig) className += " auth0-lock-social-big-button";

  return (
    <button
      className={className}
      data-provider={strategy}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <div className="auth0-lock-social-button-icon" />
      <div className="auth0-lock-social-button-text">
        {label}
      </div>
    </button>
  );
};

AuthButton.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  isBig: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  strategy: React.PropTypes.string.isRequired
};

AuthButton.defaultProps = {
  disabled: false,
  isBig: true
};

export default AuthButton;
