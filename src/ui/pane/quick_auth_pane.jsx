import React from 'react';
import AuthButton from '../button/auth_button';

const QuickAuthPane = (props) => {
  const {
    alternativeLabel,
    alternativeClickHandler,
    buttonLabel,
    buttonClickHandler,
    header,
    strategy
  } = props;

  const alternative = alternativeLabel
    ? <p className="auth0-lock-alternative">
        <a
          className="auth0-lock-alternative-link"
          href="#"
          onClick={e => {e.preventDefault(); alternativeClickHandler(e)}}
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
        onClick={e => {e.preventDefault(); buttonClickHandler(e)}}
        strategy={strategy}
      />

      {alternative}

      <div className="auth0-loading-container">
        <div className="auth0-loading" />
      </div>
    </div>
  );
};

QuickAuthPane.propTypes = {
  alternativeLabel: React.PropTypes.string,
  alternativeClickHandler: (props, propName, component, ...rest) => {
    if (props.alternativeLabel !== undefined) {
      return React.PropTypes.func.isRequired(props, propName, component, ...rest);
    }
  },
  buttonLabel: React.PropTypes.string.isRequired,
  buttonClickHandler: React.PropTypes.func.isRequired,
  header: React.PropTypes.element,
  strategy: React.PropTypes.string.isRequired
};

export default QuickAuthPane;
