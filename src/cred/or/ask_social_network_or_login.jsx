import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from '../social/social_buttons_pane';
import LoginPane from '../../database/login_pane';
import PaneSeparator from '../../lock/pane_separator';
import { authWithUsername, hasScreen, signUpLink } from '../../database/index';
import { signInWithEmail, signInWithUsername } from '../../database/actions';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';
import LoginSignUpTabs from '../../database/login_sign_up_tabs';
import * as l from '../../lock/index';

export default class AskSocialNetworkOrLogin extends Screen {

  constructor() {
    super();
    this.name = "networkOrLogin";
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  renderTabs(lock) {
    return this.shouldRenderTabs(lock)
      ? <LoginSignUpTabs
          key="loginsignup"
          lock={lock}
          loginTabLabel={this.t(lock, ["loginTabLabel"], {__textOnly: true})}
          signUpLink={signUpLink(lock)}
          signUpTabLabel={this.t(lock, ["signUpTabLabel"], {__textOnly: true})}
        />
      : null;
  }

  submitHandler(lock) {
    return authWithUsername(lock) ? signInWithUsername : signInWithEmail;
  }

  render({lock}) {
    const social = l.getEnabledConnections(lock, "social").count() > 0
      && <SocialButtonsPane
           lock={lock}
           smallButtonsHeader={this.shouldRenderTabs(lock) ? '' : this.t(lock, ["smallSocialButtonsHeader"], {__textOnly: true})}
         />;

    const db = l.getEnabledConnections(lock, "database").count() > 0
      && <LoginPane
           emailInputPlaceholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
           forgotPasswordLabel={this.t(lock, ["forgotPasswordLabel"], {__textOnly: true})}
           lock={lock}
           passwordInputPlaceholder={this.t(lock, ["passwordInputPlaceholder"], {__textOnly: true})}
           usernameInputPlaceholder={this.t(lock, ["usernameInputPlaceholder"], {__textOnly: true})}
         />;

    const separator = social && db
      && <PaneSeparator>{this.t(lock, ["separatorText"])}</PaneSeparator>;

    return <div>{social}{separator}{db}</div>;
  }

  shouldRenderTabs(lock) {
    return l.getEnabledConnections(lock, "database").count() > 0
      && hasScreen(lock, "signUp");
  }

}
