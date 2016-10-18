import React from 'react';

const AuthButton = (props) => {
  const { 
    disabled, 
    isBig, 
    label, 
    onClick, 
    strategy, 
    icon,
    primaryColor,
    foregroundColor 
  } = props;

  let className = "auth0-lock-social-button";
  if (isBig) className += " auth0-lock-social-big-button";

  const backgroundStyle = primaryColor ? { backgroundColor: primaryColor } : {};
  const foregroundStyle = foregroundColor ? { color: foregroundColor } : {};
  const iconStyle = icon ? { backgroundImage: `url('${icon}')` } : {};

  return (
    <button
      className={className}
      data-provider={strategy}
      disabled={disabled}
      onClick={onClick}
      style={backgroundStyle}
      type="button"
    >
      <div className="auth0-lock-social-button-icon" style={iconStyle} />
      <div className="auth0-lock-social-button-text" style={foregroundStyle} >
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
  strategy: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string,
  primaryColor: React.PropTypes.string,
  foregroundColor: React.PropTypes.string
};

AuthButton.defaultProps = {
  disabled: false,
  isBig: true
};

export default AuthButton;
