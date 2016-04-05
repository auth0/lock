import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import LoginPane from '../../database/login_pane';
import PaneSeparator from '../../lock/pane_separator';
import { hasScreen, signUpLink, authWithUsername } from '../../database/index';
import { signIn as databaseSignIn } from '../../database/actions';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';
import LoginSignUpTabs from '../../database/login_sign_up_tabs';
import * as l from '../../lock/index';
import { icon } from '../../ui/input/password_input';
import * as c from '../../field/index';
import { emailDomain } from '../../field/email';
import {
  signIn as enterpriseSignIn,
  startHRD
} from '../../connection/enterprise/actions';
import {
  findADConnectionWithoutDomain,
  isADEnabled,
  isHRDDomain,
  isSSODomain
} from '../../connection/enterprise';


const SingleSignOnNotice = ({children}) => (
  <div className="auth0-sso-notice-container">
    <span dangerouslySetInnerHTML={{__html: icon}} /> {" "}
    <span className="auth0-sso-notice">{children}</span>
  </div>
);

export default class Login extends Screen {

  constructor() {
    super("login");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  renderTabs(model) {
    return this.shouldRenderTabs(model);
  }

  submitHandler(model) {
    if (l.getEnabledConnections(model, "social").count() === l.getEnabledConnections(model).count()) {
      return null;
    }

    if (isHRDDomain(model, c.email(model))) {
      return startHRD;
    }

    return this.isSSOEnabled(model) || l.getEnabledConnections(model, "database").count() === 0
      ? enterpriseSignIn
      : databaseSignIn;
  }

  shouldRenderTabs(lock) {
    return l.getEnabledConnections(lock, "database").count() > 0
      && hasScreen(lock, "signUp")
      && !this.isSSOEnabled(lock);
  }

  isSSOEnabled(model) {
    return isSSODomain(
      model,
      this.usernameStyle(model) === "username"
        ? c.username(model)
        : c.email(model)
    );
  }

  usernameStyle(model) {
    return authWithUsername(model) && !isADEnabled(model)
      ? "username"
      : "email";
  }

  render({model}) {
    const sso = this.isSSOEnabled(model);

    const tabs = this.shouldRenderTabs(model)
      && <LoginSignUpTabs
           key="loginsignup"
           lock={model}
           loginTabLabel={this.t(model, ["loginTabLabel"], {__textOnly: true})}
           signUpLink={signUpLink(model)}
           signUpTabLabel={this.t(model, ["signUpTabLabel"], {__textOnly: true})}
         />;

    const social = !sso && l.getEnabledConnections(model, "social").count() > 0
      && <SocialButtonsPane
           lock={model}
           signUp={false}
           smallButtonsHeader={this.shouldRenderTabs(model) ? '' : this.t(model, ["smallSocialButtonsHeader"], {__textOnly: true})}
           t={::this.t}
         />;

    const showPassword = !sso
      && (l.getEnabledConnections(model, "database").count() > 0
         || findADConnectionWithoutDomain(model));

    const showForgotPasswordLink = showPassword
      && l.getEnabledConnections(model, "database").count() > 0;

    const login = (sso
      || l.getEnabledConnections(model, "database").count() > 0
      || l.getEnabledConnections(model, "enterprise").count() > 0)
      && <LoginPane
           emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
           forgotPasswordLabel={this.t(model, ["forgotPasswordLabel"], {__textOnly: true})}
           lock={model}
           passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
           showForgotPasswordLink={showForgotPasswordLink}
           showPassword={showPassword}
           usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
           usernameStyle={this.usernameStyle(model)}
         />;

    const ssoNotice = sso
      && <SingleSignOnNotice>
           {this.t(model, ["ssoEnabled"], {__textOnly: true})}
         </SingleSignOnNotice>;

    const separator = social && login
      && <PaneSeparator>{this.t(model, ["separatorText"])}</PaneSeparator>;

    return <div>{ssoNotice}{tabs}{social}{separator}{login}</div>;
  }

}
