import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from './email_pane';


export default class AskEmail extends Screen {

  constructor(lock) {
    super("email", lock);
  }

  render({lock}) {
    return (
      <EmailPane
        lock={lock}
        placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
