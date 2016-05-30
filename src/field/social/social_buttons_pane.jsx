import React from 'react';
import AuthButton from '../../ui/button/auth_button';
import * as l from '../../core/index';
import { logIn } from '../../quick-auth/actions';
import { displayName, socialConnections } from '../../connection/social/index';

export default class SocialButtonsPane extends React.Component {

  render() {
    // TODO: i don't like that it receives the instructions tanslated
    // but it also takes the t fn
    const {
      bigButtons,
      instructions,
      labelFn,
      lock,
      showLoading,
      signUp
    } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    const buttons = socialConnections(lock).map(x => (
      <AuthButton
        isBig={bigButtons}
        key={x.get("name")}
        label={labelFn(signUp ? "signUpWithLabel" : "loginWithLabel", displayName(x))}
        onClick={() => logIn(l.id(lock), x)}
        strategy={x.get("strategy")}
      />
    ));

    const loading = showLoading
      && <div className="auth0-loading-container">
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
  bigButtons: React.PropTypes.bool.isRequired,
  instructions: React.PropTypes.any,
  labelFn: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired,
  showLoading: React.PropTypes.bool.isRequired,
  signUp: React.PropTypes.bool.isRequired
};

SocialButtonsPane.defaultProps = {
  showLoading: false
};
