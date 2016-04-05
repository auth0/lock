import React from 'react';
import Screen from '../../lock/screen';
import SocialButtonsPane from './social_buttons_pane';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

export default class AskSocialNetwork extends Screen {

  constructor() {
    super("network");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render({model, t}) {
    return(
      <SocialButtonsPane
        lock={model}
        showLoading={true}
        signUp={false}
        smallButtonsHeader={t("smallSocialButtonsHeader", {__textOnly: true})}
        t={t}
      />
    );
  }
}
