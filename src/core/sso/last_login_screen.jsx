import React from 'react';
import Screen from '../screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { logIn, skipQuickAuth } from '../../quick-auth/actions';
import { lastUsedConnection, lastUsedUsername } from './index';
import * as l from '../index';
import { renderSignedInConfirmation } from '../signed_in_confirmation';

const Component = ({model, t}) => {
  const headerText = t("headerText") || null;
  const header = headerText && <p>{headerText}</p>;

  const buttonClickHandler = () => {
    logIn(l.id(model), lastUsedConnection(model), lastUsedUsername(model));
  };

  return (
    <QuickAuthPane
      alternativeLabel={t("skipLastLoginLabel", {__textOnly: true})}
      alternativeClickHandler={() => skipQuickAuth(l.id(model))}
      buttonLabel={lastUsedUsername(model)}
      buttonClickHandler={buttonClickHandler}
      header={header}
      strategy={lastUsedConnection(model).get("strategy")}
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
