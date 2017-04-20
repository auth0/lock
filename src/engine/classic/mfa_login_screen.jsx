import React from 'react';
import Screen from '../../core/screen';
import MFAPane from '../../connection/database/mfa_pane';
import * as i18n from '../../i18n';
import { cancelMFALogin, logIn } from '../../connection/database/actions';
import { hasScreen } from '../../connection/database/index';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

const Component = ({ i18n, model }) => {
  return (
    <MFAPane
      mfaInputPlaceholder={i18n.str('mfaInputPlaceholder')}
      i18n={i18n}
      instructions={i18n.str('mfaLoginInstructions')}
      lock={model}
      title={i18n.str('mfaLoginTitle')}
    />
  );
};

export default class MFALoginScreen extends Screen {
  constructor() {
    super('mfa.mfaCode');
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['mfaSubmitLabel']);
  }

  submitHandler(m) {
    return id => logIn(id, true);
  }

  render() {
    return Component;
  }

  backHandler(m) {
    return hasScreen(m, 'login') ? cancelMFALogin : undefined;
  }
}
