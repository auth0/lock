import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from './email_pane';


export default class AskEmail extends Screen {

  constructor() {
    super("email");
  }

  render({lock}) {
    return (
      <EmailPane
        lock={lock}
        placeholder={this.t(lock, ["emailInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
