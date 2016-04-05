import React from 'react';
import Screen from '../../lock/screen';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';
import HRDPane from './hrd_pane';
import { cancelHRD, signIn } from './actions';
import { isSingleHRDConnection, ssoDomain }  from '../enterprise';

export default class HRDScreen extends Screen {

  constructor() {
    super("hrd");
  }

  backHandler(model) {
    return isSingleHRDConnection(model) ? null : cancelHRD;
  }

  submitHandler(model) {
    return signIn;
  }

  renderAuxiliaryPane(model) {
    return renderSignedInConfirmation(model);
  }

  render({model}) {
    const headerText = this.t(model, ["headerText"], {domain: ssoDomain(model)}) || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <HRDPane
        header={header}
        model={model}
        passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
        usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
