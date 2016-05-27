import React from 'react';
import Screen from '../../core/screen';
import VcodePane from './vcode_pane';

const Component = ({i18n, model}) => (
  <VcodePane
    lock={model}
    placeholder={i18n.str("codeInputPlaceholder")}
    resendLabel={i18n.str("resendLabel")}
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
