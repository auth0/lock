import React from 'react';
import Screen from '../../core/screen';
import VcodePane from '../../field/vcode/vcode_pane';
import { isEmail } from './index';
import { restart, logIn } from './actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { getFieldValue } from '../../field/index';
import { humanPhoneNumberWithDiallingCode } from '../../field/phone_number';

const Component = ({ i18n, model }) => {
  const instructions = isEmail(model)
    ? i18n.html('passwordlessEmailCodeInstructions', getFieldValue(model, 'email'))
    : i18n.html('passwordlessSMSCodeInstructions', humanPhoneNumberWithDiallingCode(model));

  return (
    <VcodePane
      instructions={instructions}
      lock={model}
      placeholder={i18n.str('codeInputPlaceholder')}
      resendLabel={i18n.str('resendCodeAction')}
      onRestart={restart}
    />
  );
};

export default class VcodeScreen extends Screen {
  constructor() {
    super('vcode');
  }

  backHandler() {
    return restart;
  }

  submitHandler() {
    return logIn;
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render() {
    return Component;
  }
}
