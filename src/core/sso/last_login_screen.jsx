import React from 'react';
import Screen from '../screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { signIn } from './actions';
import { skipQuickAuth } from '../../quick_auth/actions';
import { lastUsedConnection, lastUsedUsername } from './index';
import * as l from '../index';
import { renderSignedInConfirmation } from '../signed_in_confirmation';

const Component = ({model, t}) => {
  const headerText = t("headerText") || null;
  const header = headerText && <p>{headerText}</p>;

  return (
    <QuickAuthPane
      alternativeLabel={t("skipLastLoginLabel", {__textOnly: true})}
      alternativeClickHandler={() => skipQuickAuth(l.id(model))}
      buttonLabel={lastUsedUsername(model)}
      buttonClickHandler={() => signIn(l.id(model), lastUsedConnection(model))}
      header={header}
      strategy={lastUsedConnection(model).strategy}
    />
  );
};

export default class LastLoginScreen extends Screen {

  constructor() {
    super("lastLogin");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }

}
