import React from 'react';
import ConfirmationPane from '../widget/confirmation_pane';
import { closeLock } from '../lock/actions';
import * as l from '../lock/index';
import { shouldAutoLogin } from './index';


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

    // TODO: handle login error properly, consider having two success messages
    // (with and without auto login).
    const message = shouldAutoLogin(lock) && !lock.get("signedIn")
      ? "signed up successfuly but couldn't log in"
      : this.t(["success"]);

    return (
      <ConfirmationPane closeHandler={closeHandler}>
        <p>{message}</p>
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

  return lock.get("signedUp") && !l.submitting(lock)
    ? <SignedUpConfirmation {...props} />
    : null;
}
