import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from './email_pane';


export default class AskEmail extends Screen {

  constructor() {
    super("email");
  }

  render({model, t}) {
    return (
      <EmailPane
        lock={model}
        placeholder={t("emailInputPlaceholder", {__textOnly: true})}
      />
    );
  }

}
