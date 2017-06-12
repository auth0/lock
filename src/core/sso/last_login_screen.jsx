import React from 'react';
import Screen from '../screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { logIn, skipQuickAuth } from '../../quick-auth/actions';
import { lastUsedConnection, lastUsedUsername } from './index';
import * as l from '../index';
import { renderSignedInConfirmation } from '../signed_in_confirmation';
import { STRATEGIES as SOCIAL_STRATEGIES } from '../../connection/social/index';

// TODO: handle this from CSS
function icon(strategy) {
  if (SOCIAL_STRATEGIES[strategy]) return strategy;
  if (strategy === 'google-apps') return strategy;
  if (~['adfs', 'office365', 'waad'].indexOf(strategy)) return 'windows';
  return 'auth0';
}

const Component = ({ i18n, model }) => {
  const headerText = i18n.html('lastLoginInstructions') || null;
  const header = headerText && <p>{headerText}</p>;

  const buttonClickHandler = () => {
    logIn(l.id(model), lastUsedConnection(model), lastUsedUsername(model));
  };

  return (
    <QuickAuthPane
      alternativeLabel={i18n.str('notYourAccountAction')}
      alternativeClickHandler={() => skipQuickAuth(l.id(model))}
      buttonLabel={lastUsedUsername(model)}
      buttonClickHandler={buttonClickHandler}
      header={header}
      strategy={icon(lastUsedConnection(model).get('strategy'))}
    />
  );
};

export default class LastLoginScreen extends Screen {
  constructor() {
    super('lastLogin');
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }
}
