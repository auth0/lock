import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from './email_pane';


export default class AskEmail extends Screen {

  constructor(lock, submitHandler, renderAuxilaryPane) {
    super("email", lock);
    this._submitHandler = submitHandler;
    this._renderAuxiliaryPane = renderAuxilaryPane;
  }

  submitHandler() {
    return this._submitHandler;
  }

  renderAuxiliaryPane() {
    return this._renderAuxiliaryPane;
  }

  render({lock}) {
    return (
      <EmailPane
        lock={lock}
        placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
      />
    );
  }

}
