import React from 'react';
import VcodePane from './vcode_pane';

export default class AskVcode extends React.Component {

  render() {
    const { lock, placeholder, resendLabel } = this.props;

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
