import React from 'react';
import ConfirmationPane from '../lock/confirmation_pane';
import { closeLock } from '../lock/actions';
import * as l from '../lock/index';


export default class SignedUpConfirmation extends React.Component {

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["signedUp"].concat(keyPath), params);
  }

  handleClose() {
    const { closeHandler, lock } = this.props;
    closeHandler(l.id(lock));
  }

  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <ConfirmationPane closeHandler={closeHandler}>
        <p>{this.t(["success"])}</p>
      </ConfirmationPane>
    );
  }

}

SignedUpConfirmation.propTypes = {
  closeHandler: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired
};

export function renderSignedUpConfirmation(lock, props = {}) {
  props.closeHandler = closeLock;
  props.key = "auxiliarypane";
  props.lock = lock;

  return lock.get("signedUp", false) ? <SignedUpConfirmation {...props} /> : null;
}
