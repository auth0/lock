import PropTypes from 'prop-types';
import React from 'react';
import AuthButton from '../../ui/button/auth_button';
import * as l from '../../core/index';
import { logIn } from '../../quick-auth/actions';
import { displayName, socialConnections, authButtonsTheme } from '../../connection/social/index';
import { emitFederatedLoginEvent } from './event';

export default class SocialButtonsPane extends React.Component {
  handleSubmit(provider, isSignUp) {
    emitFederatedLoginEvent(this.props.lock, provider, isSignUp);
    return logIn(l.id(this.props.lock), provider);
  }

  render() {
    // TODO: i don't like that it receives the instructions tanslated
    // but it also takes the t fn
    const { bigButtons, instructions, labelFn, lock, showLoading, signUp, disabled } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    const themes = authButtonsTheme(lock);

    const buttons = socialConnections(lock).map(x => {
      const buttonTheme = themes.get(x.get('name'));
      const connectionName = buttonTheme && buttonTheme.get('displayName');
      const primaryColor = buttonTheme && buttonTheme.get('primaryColor');
      const foregroundColor = buttonTheme && buttonTheme.get('foregroundColor');
      const icon = buttonTheme && buttonTheme.get('icon');

      return (
        <AuthButton
          isBig={bigButtons}
          key={x.get('name')}
          label={labelFn(
            signUp ? 'signUpWithLabel' : 'loginWithLabel',
            connectionName || displayName(x)
          )}
          onClick={() => this.handleSubmit(x, signUp)}
          strategy={x.get('strategy')}
          primaryColor={primaryColor}
          foregroundColor={foregroundColor}
          icon={icon}
          disabled={disabled}
        />
      );
    });

    const loading =
      showLoading &&
      <div className="auth0-loading-container">
        <div className="auth0-loading" />
      </div>;

    return (
      <div className="auth-lock-social-buttons-pane">
        {header}
        <div className="auth0-lock-social-buttons-container">{buttons}</div>
        {loading}
      </div>
    );
  }
}

SocialButtonsPane.propTypes = {
  bigButtons: PropTypes.bool.isRequired,
  instructions: PropTypes.any,
  labelFn: PropTypes.func.isRequired,
  lock: PropTypes.object.isRequired,
  showLoading: PropTypes.bool.isRequired,
  signUp: PropTypes.bool.isRequired,
  disabled: PropTypes.bool
};

SocialButtonsPane.defaultProps = {
  showLoading: false,
  disabled: false
};
