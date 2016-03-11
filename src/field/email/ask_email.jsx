import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from './email_pane';


export default class AskEmail extends Screen {

  constructor() {
    super("email");
  }

  render({model}) {
    return (
      <EmailPane
        lock={model}
        placeholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
