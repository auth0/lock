import React from 'react';
import SuccessPane from '../../ui/box/success_pane';
import { closeLock } from '../../core/actions';
import * as l from '../../core/index';
import { shouldAutoLogin } from './index';


export default class SignedUpConfirmation extends React.Component {

  // TODO: can't we get this from pops?
  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["success", keyPath], params);
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
        <p>{this.t("signUp")}</p>
      </SuccessPane>
    );
  }

}

SignedUpConfirmation.propTypes = {
  closeHandler: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired
};

export function renderSignedUpConfirmation(m, props = {}) {
  props.closeHandler = closeLock;
  props.key = "auxiliarypane";
  props.lock = m;

  return m.get("signedUp") && !shouldAutoLogin(m)
    ? <SignedUpConfirmation {...props} />
    : null;
}
