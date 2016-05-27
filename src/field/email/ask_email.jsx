import React from 'react';
import Screen from '../../core/screen';
import EmailPane from './email_pane';

const Component = ({i18n, model}) => (
  <EmailPane
    lock={model}
    placeholder={i18n.str("emailInputPlaceholder")}
  />
);

export default class AskEmail extends Screen {

  constructor() {
    super("email");
  }

  render() {
    return Component;
  }

}
