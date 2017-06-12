import PropTypes from 'prop-types';
import React from 'react';
import AuthButton from '../button/auth_button';

const QuickAuthPane = props => {
  const {
    alternativeLabel,
    alternativeClickHandler,
    buttonLabel,
    buttonClickHandler,
    header,
    strategy,
    buttonIcon,
    primaryColor,
    foregroundColor
  } = props;

  const alternative = alternativeLabel
    ? <p className="auth0-lock-alternative">
        <a
          className="auth0-lock-alternative-link"
          href="#"
          onClick={e => {
            e.preventDefault();
            alternativeClickHandler(e);
          }}
        >
          {alternativeLabel}
        </a>
      </p>
    : null;

  return (
    <div className="auth0-lock-last-login-pane">
      {header}

      <AuthButton
        label={buttonLabel}
        onClick={e => {
          e.preventDefault();
          buttonClickHandler(e);
        }}
        strategy={strategy}
        primaryColor={primaryColor}
        foregroundColor={foregroundColor}
        icon={buttonIcon}
      />

      {alternative}

      <div className="auth0-loading-container">
        <div className="auth0-loading" />
      </div>
    </div>
  );
};

QuickAuthPane.propTypes = {
  alternativeLabel: PropTypes.string,
  alternativeClickHandler: (props, propName, component, ...rest) => {
    if (props.alternativeLabel !== undefined) {
      return PropTypes.func.isRequired(props, propName, component, ...rest);
    }
  },
  buttonLabel: PropTypes.string.isRequired,
  buttonClickHandler: PropTypes.func.isRequired,
  header: PropTypes.element,
  strategy: PropTypes.string.isRequired
};

export default QuickAuthPane;
