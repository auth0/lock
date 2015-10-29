import React from 'react';
import Screen from '../../lock/screen';
import VcodePane from './vcode_pane';

export default class AskVcode extends Screen {

  constructor(lock, isDone) {
    super("code", lock, isDone);
  }

  render() {
    return (
      <VcodePane
        lock={this.lock}
        placeholder={this.t(["codeInputPlaceholder"], {__textOnly: true})}
        resendLabel={this.t(["resendLabel"], {__textOnly: true})}
        tabIndex={1}
      />
    );
  }

}
