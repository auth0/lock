import React from 'react';
import Screen from '../../lock/screen';
import KerberosPane from './kerberos_pane';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

export default class KerberosScreen extends Screen {

  constructor() {
    super("kerberos");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render({model}) {
    const headerText = this.t(model, ["headerText"]) || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <KerberosPane
        header={header}
        lock={model}
        skipLastLoginLabel={this.t(model, ["skipLastLoginLabel"], {__textOnly: true})}
      />
    );
  }

}
