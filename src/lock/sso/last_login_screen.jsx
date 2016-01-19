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

  render({lock}) {
    return (
      <LastLoginPane
        lock={lock}
        skipLastLoginLabel={this.t(lock, ["skipLastLoginLabel"], {__textOnly: true})}
      />
    );
  }

}
