import React from 'react';
import Screen from '../../core/screen';
import VcodePane from './vcode_pane';

const Component = ({model, t}) => (
  <VcodePane
    lock={model}
    placeholder={t("codeInputPlaceholder", {__textOnly: true})}
    resendLabel={t("resendLabel", {__textOnly: true})}
  />
);

export default class AskVcode extends Screen {

  constructor(name = "code") {
    super(name);
  }

  render() {
    return Component;
  }

}
