import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from './email_pane';


export default class AskEmail extends Screen {

  constructor(lock, isDone, submitHandler, renderAuxilaryPane) {
    super("email", lock, isDone);
    this._submitHandler = submitHandler;
    this._renderAuxiliaryPane = renderAuxilaryPane;
  }

  submitHandler() {
    return this._submitHandler;
  }

  renderAuxiliaryPane() {
    return this._renderAuxiliaryPane;
  }

  render() {
    return (
      <EmailPane
        lock={this.lock}
        placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
        tabIndex={1}
      />
    );
  }

}
