import React from 'react';
import VcodePane from './vcode_pane';
import * as l from '../../lock/index';

const NAME = "code";

export default class AskVcode extends React.Component {

  render() {
    const { lock, resendLabel } = this.props;
    const placeholder =
      l.ui.t(lock, [NAME, "codeInputPlaceholder"], {__textOnly: true});

    return (
      <VcodePane
        lock={lock}
        placeholder={placeholder}
        resendLabel={resendLabel}
        tabIndex={1}
      />
    );
  }

}
