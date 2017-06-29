import React from 'react';
import Screen from '../../core/screen';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import LoginPane from '../../connection/database/login_pane';
import PaneSeparator from '../../core/pane_separator';
import {
  databaseConnection,
  databaseUsernameStyle,
  databaseUsernameValue,
  defaultDatabaseConnection,
  hasInitialScreen,
  hasScreen,
  signUpLink
} from '../../connection/database/index';
import { logIn as databaseLogIn } from '../../connection/database/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import LoginSignUpTabs from '../../connection/database/login_sign_up_tabs';
import * as l from '../../core/index';
import { logIn as enterpriseLogIn, startHRD } from '../../connection/enterprise/actions';
import {
  defaultEnterpriseConnection,
  findADConnectionWithoutDomain,
  isHRDDomain
} from '../../connection/enterprise';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';
import { hasOnlyClassicConnections, isSSOEnabled, useBigSocialButtons } from '../classic';
import * as i18n from '../../i18n';

function shouldRenderTabs(m) {
  if (isSSOEnabled(m)) return false;
  if (l.hasSomeConnections(m, 'database')) return hasScreen(m, 'signUp');
  if (l.hasSomeConnections(m, 'social') && hasInitialScreen(m, 'signUp'))
    return hasScreen(m, 'signUp');
}

const Component = ({ i18n, model }) => {
  const sso = isSSOEnabled(model);
  const onlySocial = hasOnlyClassicConnections(model, 'social');

  const tabs =
    shouldRenderTabs(model) &&
    <LoginSignUpTabs
      key="loginsignup"
      lock={model}
      loginLabel={i18n.str('loginLabel')}
      signUpLink={signUpLink(model)}
      signUpLabel={i18n.str('signUpLabel')}
    />;

  const social =
    l.hasSomeConnections(model, 'social') &&
    <SocialButtonsPane
      bigButtons={useBigSocialButtons(model)}
      instructions={i18n.html('socialLoginInstructions')}
      labelFn={i18n.str}
      lock={model}
      showLoading={onlySocial}
      signUp={false}
    />;

  const showPassword =
    !sso && (l.hasSomeConnections(model, 'database') || !!findADConnectionWithoutDomain(model));

  const showForgotPasswordLink = showPassword && l.hasSomeConnections(model, 'database');

  const loginInstructionsKey = social
    ? 'databaseEnterpriseAlternativeLoginInstructions'
    : 'databaseEnterpriseLoginInstructions';

  const usernameInputPlaceholderKey = databaseUsernameStyle(model) === 'any' ||
    l.countConnections(model, 'enterprise') > 1
    ? 'usernameOrEmailInputPlaceholder'
    : 'usernameInputPlaceholder';

  const usernameStyle = databaseUsernameStyle(model);

  const login =
    (sso || l.hasSomeConnections(model, 'database') || l.hasSomeConnections(model, 'enterprise')) &&
    <LoginPane
      emailInputPlaceholder={i18n.str('emailInputPlaceholder')}
      forgotPasswordAction={i18n.str('forgotPasswordAction')}
      i18n={i18n}
      instructions={i18n.html(loginInstructionsKey)}
      lock={model}
      passwordInputPlaceholder={i18n.str('passwordInputPlaceholder')}
      showForgotPasswordLink={showForgotPasswordLink}
      showPassword={showPassword}
      usernameInputPlaceholder={i18n.str(usernameInputPlaceholderKey)}
      usernameStyle={usernameStyle}
    />;

  const ssoNotice =
    sso &&
    <SingleSignOnNotice>
      {i18n.str('ssoEnabled')}
    </SingleSignOnNotice>;

  const separator = social && login && <PaneSeparator />;

  return <div>{ssoNotice}{tabs}{social}{separator}{login}</div>;
};

export default class Login extends Screen {
  constructor() {
    super('main.login');
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  renderTabs(model) {
    return shouldRenderTabs(model);
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['loginSubmitLabel']);
  }

  isSubmitDisabled(m) {
    // it should disable the submit button if there is any connection that
    // requires username/password and there is no enterprise with domain
    // that matches with the email domain entered for HRD
    return (
      !l.hasSomeConnections(m, 'database') && // no database connection
      !findADConnectionWithoutDomain(m) && // no enterprise without domain
      !isSSOEnabled(m)
    ); // no matching domain
  }

  submitHandler(model) {
    if (hasOnlyClassicConnections(model, 'social')) {
      return null;
    }

    if (isHRDDomain(model, databaseUsernameValue(model)) && !l.oidcConformant(model)) {
      return id => startHRD(id, databaseUsernameValue(model));
    }
    const customResolvedConnection = l.resolvedConnection(model);
    if (customResolvedConnection && customResolvedConnection.type === 'database') {
      return databaseLogIn;
    }

    const useDatabaseConnection =
      !isSSOEnabled(model) &&
      databaseConnection(model) &&
      (defaultDatabaseConnection(model) || !defaultEnterpriseConnection(model));

    return useDatabaseConnection ? databaseLogIn : enterpriseLogIn;
  }

  render() {
    return Component;
  }
}
