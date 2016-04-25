import React from 'react';
import Screen from '../../core/screen';
import EmailPane from './email_pane';

const Component = ({model, t}) => (
  <EmailPane
    lock={model}
    placeholder={t("emailInputPlaceholder", {__textOnly: true})}
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
