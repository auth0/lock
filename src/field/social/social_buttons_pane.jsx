import React from 'react';
import AuthButton from '../../ui/button/auth_button';
import * as l from '../../core/index';
import { logIn } from '../../quick_auth/actions';
import {
  displayName,
  socialConnections,
  useBigButtons
} from '../../connection/social/index';

export default class SocialButtonsPane extends React.Component {

  render() {
    const { lock, showLoading, signUp, smallButtonsHeader, t } = this.props;

    // TODO: translate here small buttons header
    const header = !useBigButtons(lock)
      && smallButtonsHeader
      && <p className="auth-lock-small-social-buttons-header">
           {smallButtonsHeader}
         </p>;

    const buttons = socialConnections(lock).map(x => (
      <AuthButton
        isBig={useBigButtons(lock)}
        key={x.get("name")}
        label={t(signUp ? "signUpWith" : "loginWith", {idp: displayName(x), __textOnly: true})}
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
  lock: React.PropTypes.object.isRequired,
  showLoading: React.PropTypes.bool.isRequired,
  signUp: React.PropTypes.bool.isRequired,
  smallButtonsHeader: React.PropTypes.string,
  t: React.PropTypes.func.isRequired
};

SocialButtonsPane.defaultProps = {
  showLoading: false
};
