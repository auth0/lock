import React from 'react';
import Screen from '../screen';
import LastLoginPane from './last_login_pane';
import { renderSignedInConfirmation } from '../signed_in_confirmation';

export default class LastLoginScreen extends Screen {

  constructor() {
    super("lastLogin");
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  render({model}) {
    const headerText = this.t(model, ["headerText"]) || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <LastLoginPane
        header={header}
        lock={model}
        skipLastLoginLabel={this.t(model, ["skipLastLoginLabel"], {__textOnly: true})}
      />
    );
  }

}
