import React from 'react';
import Screen from '../../lock/screen';
import VcodePane from './vcode_pane';

export default class AskVcode extends Screen {

  constructor(name = "code") {
    super(name);
  }

  render({model, t}) {
    return (
      <VcodePane
        lock={model}
        placeholder={t("codeInputPlaceholder", {__textOnly: true})}
        resendLabel={t("resendLabel", {__textOnly: true})}
      />
    );
  }

}
