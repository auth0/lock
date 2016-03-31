import React from 'react';
import Screen from '../../lock/screen';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';
import HRDPane from './hrd_pane';
import { cancelHRD, hrdSignIn } from './actions';
import { isSingleHRDConnection, ssoDomain }  from '../enterprise';

export default class HRDScreen extends Screen {

  constructor() {
    super("hrd");
  }

  backHandler(model) {
    return isSingleHRDConnection(model) ? null : cancelHRD;
  }

  submitHandler(model) {
    return hrdSignIn;
  }

  renderAuxiliaryPane(model) {
    return renderSignedInConfirmation(model);
  }

  renderHeaderText(model) {
    return this.t(model, ["headerText"], {domain: ssoDomain(model)});
  }

  render({model}) {
    return (
      <HRDPane
        model={model}
        passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
        usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
