import React from 'react';
import Screen from '../../core/screen';

import { hasScreen, mustAcceptTerms, termsAccepted } from '../../connection/database/index';
import { signUp, toggleTermsAcceptance } from '../../connection/database/actions';
import { hasOnlyClassicConnections, isSSOEnabled, useBigSocialButtons } from '../classic';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { renderSignedUpConfirmation } from '../../connection/database/signed_up_confirmation';
import { renderOptionSelection } from '../../field/index';
import { logIn as enterpriseLogIn } from '../../connection/enterprise/actions';
import * as l from '../../core/index';
import * as i18n from '../../i18n';

import SignUpPane from './sign_up_pane';
import PaneSeparator from '../../core/pane_separator';
import SignUpTerms from '../../connection/database/sign_up_terms';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import LoginSignUpTabs from '../../connection/database/login_sign_up_tabs';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';

const Component = ({ i18n, model }) => {
  const sso = isSSOEnabled(model) && hasScreen(model, 'login');
  const ssoNotice =
    sso &&
    <SingleSignOnNotice>
      {i18n.str('ssoEnabled')}
    </SingleSignOnNotice>;

  const tabs =
    !sso &&
    hasScreen(model, 'login') &&
    <LoginSignUpTabs
      key="loginsignup"
      lock={model}
      loginLabel={i18n.str('loginLabel')}
      signUpLabel={i18n.str('signUpLabel')}
    />;

  const social =
    l.hasSomeConnections(model, 'social') &&
    <SocialButtonsPane
      bigButtons={useBigSocialButtons(model)}
      instructions={i18n.html('socialSignUpInstructions')}
      labelFn={i18n.str}
      lock={model}
      signUp={true}
      disabled={!termsAccepted(model)}
    />;

  const signUpInstructionsKey = social
    ? 'databaseAlternativeSignUpInstructions'
    : 'databaseSignUpInstructions';

  const db =
    (l.hasSomeConnections(model, 'database') || l.hasSomeConnections(model, 'enterprise')) &&
    <SignUpPane
      emailInputPlaceholder={i18n.str('emailInputPlaceholder')}
      i18n={i18n}
      instructions={i18n.html(signUpInstructionsKey)}
      model={model}
      onlyEmail={sso}
      passwordInputPlaceholder={i18n.str('passwordInputPlaceholder')}
      passwordStrengthMessages={i18n.group('passwordStrength')}
      usernameInputPlaceholder={i18n.str('usernameInputPlaceholder')}
    />;

  const separator = social && db && <PaneSeparator />;

  return <div>{ssoNotice}{tabs}{social}{separator}{db}</div>;
};

export default class SignUp extends Screen {
  constructor() {
    super('main.signUp');
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['signUpSubmitLabel']);
  }

  submitHandler(m) {
    if (hasOnlyClassicConnections(m, 'social')) return null;
    if (isSSOEnabled(m)) return enterpriseLogIn;
    return signUp;
  }

  isSubmitDisabled(m) {
    return !termsAccepted(m);
  }

  renderAuxiliaryPane(lock) {
    return (
      renderSignedInConfirmation(lock) ||
      renderSignedUpConfirmation(lock) ||
      renderOptionSelection(lock)
    );
  }

  renderTabs() {
    return true;
  }

  getScreenTitle(m) {
    return i18n.str(m, 'signupTitle');
  }

  renderTerms(m, terms) {
    const checkHandler = mustAcceptTerms(m) ? () => toggleTermsAcceptance(l.id(m)) : undefined;
    return terms || mustAcceptTerms(m)
      ? <SignUpTerms checkHandler={checkHandler} checked={termsAccepted(m)}>
          {terms}
        </SignUpTerms>
      : null;
  }

  render() {
    return Component;
  }
}
