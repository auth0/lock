import React from 'react';
import AuthButton from '../../ui/button/auth_button';
import * as l from '../../lock/index';
import { signIn } from '../../social/actions';
import {
  displayName,
  socialConnections,
  useBigButtons
} from '../../social/index';

export default class SocialButtonsPane extends React.Component {

  render() {
    const { lock, showLoading, signUp, smallButtonsHeader, t } = this.props;

    const header = !useBigButtons(lock)
      && smallButtonsHeader
      && <p className="auth-lock-small-social-buttons-header">
           {smallButtonsHeader}
         </p>;

    const buttons = socialConnections(lock).map(x => (
      <AuthButton
        isBig={useBigButtons(lock)}
        key={x.name}
        onClick={() => signIn(l.id(lock), x)}
        strategy={x.strategy}
        text={t(lock, [signUp ? "signUpWith" : "loginWith"], {idp: displayName(x), __textOnly: true})}
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
