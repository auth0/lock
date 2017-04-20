import React from 'react';
import Screen from '../../core/screen';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import HRDPane from './hrd_pane';
import { cancelHRD, logIn } from './actions';
import { enterpriseDomain, isSingleHRDConnection } from '../enterprise';
import * as i18n from '../../i18n';

const Component = ({ i18n, model }) => {
  const domain = enterpriseDomain(model);

  var headerText;

  if (domain != null) {
    headerText = i18n.html('enterpriseActiveLoginInstructions', domain);
  } else {
    headerText = i18n.html('enterpriseLoginIntructions');
  }

  headerText = headerText || null;

  const header = headerText && <p>{headerText}</p>;

  return (
    <HRDPane
      header={header}
      i18n={i18n}
      model={model}
      passwordInputPlaceholder={i18n.str('passwordInputPlaceholder')}
      usernameInputPlaceholder={i18n.str('usernameInputPlaceholder')}
    />
  );
};

export default class HRDScreen extends Screen {
  constructor() {
    super('hrd');
  }

  backHandler(model) {
    return isSingleHRDConnection(model) ? null : cancelHRD;
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['loginSubmitLabel']);
  }

  submitHandler(model) {
    return logIn;
  }

  renderAuxiliaryPane(model) {
    return renderSignedInConfirmation(model);
  }

  render() {
    return Component;
  }
}
