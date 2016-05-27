import React from 'react';
import Screen from '../../core/screen';
import SocialButtonsPane from './social_buttons_pane';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

const Component = ({i18n, model}) => (
  <SocialButtonsPane
    instructions={i18n.html("socialLoginInstructions")}
    labelFn={i18n.str}
    lock={model}
    showLoading={true}
    signUp={false}
  />
);

export default class AskSocialNetwork extends Screen {

  constructor() {
    super("network");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }
}
