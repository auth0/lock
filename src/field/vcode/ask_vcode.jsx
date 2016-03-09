import React from 'react';
import Screen from '../../lock/screen';
import VcodePane from './vcode_pane';

export default class AskVcode extends Screen {

  constructor(name = "code") {
    super(name);
  }

  render({lock}) {
    return (
      <VcodePane
        lock={lock}
        placeholder={this.t(lock, ["codeInputPlaceholder"], {__textOnly: true})}
        resendLabel={this.t(lock, ["resendLabel"], {__textOnly: true})}
      />
    );
  }

}
