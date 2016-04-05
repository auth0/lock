import React from 'react';

const AuthButton = (props) => {
  const { disabled, isBig, onClick, strategy, text } = props;

  let className = "auth0-lock-social-button";
  if (isBig) className += " auth0-lock-social-big-button";

  return (
    <button
      className={className}
      data-provider={strategy}
      disabled={disabled}
      onClick={e => onClick(strategy, e)}
      type="button"
    >
      <div className="auth0-lock-social-button-icon" />
      <div className="auth0-lock-social-button-text">
        {text}
      </div>
    </button>
  );
};

AuthButton.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  isBig: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired,
  strategy: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired
};

AuthButton.defaultProps = {
  disabled: false,
  isBig: true
};

export default AuthButton;
