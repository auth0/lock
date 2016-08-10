import React from 'react';
import Screen from '../../core/screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { logIn } from '../../quick-auth/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import * as l from '../../core/index';
import { quickAuthConnection } from '../enterprise';


// TODO: handle this from CSS
function icon(strategy) {
  if (strategy === "google-apps") return strategy;
  if (~["adfs", "office365", "waad"].indexOf(strategy)) return "windows";
  return "auth0";
}

const Component = ({i18n, model}) => {
  const headerText = i18n.html("enterpriseLoginIntructions") || null;
  const header = headerText && <p>{headerText}</p>;

  return (
    <QuickAuthPane
      buttonLabel={i18n.str("loginAtLabel", quickAuthConnection(model).getIn(["domains", 0]))}
      buttonClickHandler={e => logIn(l.id(model), quickAuthConnection(model))}
      header={header}
      strategy={icon(quickAuthConnection(model).get("strategy"))}
    />
  );
};

export default class QuickAuthScreen extends Screen {

  constructor() {
    super("enterpriseQuickAuth");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }

}
