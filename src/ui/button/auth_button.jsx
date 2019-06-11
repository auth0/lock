import PropTypes from 'prop-types';
import React from 'react';

const AuthButton = props => {
  const { disabled, label, onClick, strategy, icon, primaryColor, foregroundColor } = props;

  const backgroundStyle = primaryColor ? { backgroundColor: primaryColor } : {};
  const foregroundStyle = foregroundColor ? { color: foregroundColor } : {};
  const iconStyle = icon ? { backgroundImage: `url('${icon}')` } : {};

  return (
    <button
      className="auth0-lock-social-button auth0-lock-social-big-button"
      data-provider={strategy}
      disabled={disabled}
      onClick={onClick}
      style={backgroundStyle}
      type="button"
    >
      <div className="auth0-lock-social-button-icon" style={iconStyle} />
      <div className="auth0-lock-social-button-text" style={foregroundStyle}>
        {label}
      </div>
    </button>
  );
};

AuthButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  strategy: PropTypes.string.isRequired,
  icon: PropTypes.string,
  primaryColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

AuthButton.defaultProps = {
  disabled: false
};

export default AuthButton;
