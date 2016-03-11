import React from 'react';
import Screen from '../../lock/screen';
import VcodePane from './vcode_pane';

export default class AskVcode extends Screen {

  constructor(name = "code") {
    super(name);
  }

  render({model}) {
    return (
      <VcodePane
        lock={model}
        placeholder={this.t(model, ["codeInputPlaceholder"], {__textOnly: true})}
        resendLabel={this.t(model, ["resendLabel"], {__textOnly: true})}
      />
    );
  }

}
