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

  renderTabs(model) {
    return this.shouldRenderTabs(model);
  }

  submitHandler(lock) {
    return signIn;
  }

  shouldRenderTabs(lock) {
    return l.getEnabledConnections(lock, "database").count() > 0
      && hasScreen(lock, "signUp");
  }

  render({model}) {
    const tabs = this.shouldRenderTabs(model)
      && <LoginSignUpTabs
           key="loginsignup"
           lock={model}
           loginTabLabel={this.t(model, ["loginTabLabel"], {__textOnly: true})}
           signUpLink={signUpLink(model)}
           signUpTabLabel={this.t(model, ["signUpTabLabel"], {__textOnly: true})}
         />;

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

    return <div>{tabs}{social}{separator}{db}</div>;
  }

}
