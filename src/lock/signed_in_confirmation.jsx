import React from 'react';
import SuccessPane from '../ui/box/success_pane';
import { closeLock } from './actions';
import * as l from './index';


export default class SignedInConfirmation extends React.Component {

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["signedIn"].concat(keyPath), params);
  }

  handleClose() {
    const { closeHandler, lock } = this.props;
    closeHandler(l.id(lock));
  }

  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <SuccessPane closeHandler={closeHandler}>
        <p>{this.t(["success"])}</p>
      </SuccessPane>
    );
  }

}

SignedInConfirmation.propTypes = {
  closeHandler: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired
};

export function renderSignedInConfirmation(lock, props = {}) {
  props.closeHandler = closeLock;
  props.key = "auxiliarypane";
  props.lock = lock;

  return l.signedIn(lock) ? <SignedInConfirmation {...props} /> : null;
}
