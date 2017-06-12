import PropTypes from 'prop-types';
import React from 'react';
import SuccessPane from '../ui/box/success_pane';
import { closeLock } from './actions';
import * as l from './index';
import * as i18n from '../i18n'; // TODO: can't we get this from pops?

export default class SignedInConfirmation extends React.Component {
  handleClose() {
    const { closeHandler, lock } = this.props;
    closeHandler(l.id(lock));
  }

  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <SuccessPane closeHandler={closeHandler}>
        <p>{i18n.html(lock, ['success', 'logIn'])}</p>
      </SuccessPane>
    );
  }
}

SignedInConfirmation.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  lock: PropTypes.object.isRequired
};

export function renderSignedInConfirmation(lock, props = {}) {
  props.closeHandler = closeLock;
  props.key = 'auxiliarypane';
  props.lock = lock;

  return l.loggedIn(lock) ? <SignedInConfirmation {...props} /> : null;
}
