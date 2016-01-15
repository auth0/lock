import React from 'react';
import Screen from '../screen';
import LastLoginPane from './last_login_pane';

export default class LastLoginScreen extends Screen {

  constructor() {
    super("lastLogin");
  }

  render({lock}) {
    return <LastLoginPane lock={lock} />;
  }

}
