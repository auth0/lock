import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from '../social/social_buttons_pane';
import LoginPane from '../../database/login_pane';
import PaneSeparator from '../../lock/pane_separator';
import { hasScreen, signUpLink } from '../../database/index';
import { signIn } from '../../database/actions';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';
import LoginSignUpTabs from '../../database/login_sign_up_tabs';
import * as l from '../../lock/index';

export default class AskSocialNetworkOrLogin extends Screen {

  constructor() {
    super();
    this.name = "login";
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
    return signIn;
  }

  render({model}) {
    const social = l.getEnabledConnections(model, "social").count() > 0
      && <SocialButtonsPane
           lock={model}
           signUp={false}
           smallButtonsHeader={this.shouldRenderTabs(model) ? '' : this.t(model, ["smallSocialButtonsHeader"], {__textOnly: true})}
           t={::this.t}
         />;

    const db = l.getEnabledConnections(model, "database").count() > 0
      && <LoginPane
           emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
           forgotPasswordLabel={this.t(model, ["forgotPasswordLabel"], {__textOnly: true})}
           lock={model}
           passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
           usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
         />;

    const separator = social && db
      && <PaneSeparator>{this.t(model, ["separatorText"])}</PaneSeparator>;

    return <div>{social}{separator}{db}</div>;
  }

  shouldRenderTabs(lock) {
    return l.getEnabledConnections(lock, "database").count() > 0
      && hasScreen(lock, "signUp");
  }

}
