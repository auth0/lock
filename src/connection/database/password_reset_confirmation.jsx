import PropTypes from 'prop-types';
import React from 'react';
import SuccessPane from '../../ui/box/success_pane';
import { closeLock } from '../../core/actions';
import * as l from '../../core/index';
import * as i18n from '../../i18n'; // TODO: can't we get this from props?

export default class PasswordResetConfirmation extends React.Component {
  handleClose() {
    const { closeHandler, lock } = this.props;
    closeHandler(l.id(lock));
  }

  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <SuccessPane closeHandler={closeHandler}>
        <p>{i18n.html(this.props.lock, ['success', 'forgotPassword'])}</p>
      </SuccessPane>
    );
  }
}

PasswordResetConfirmation.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  lock: PropTypes.object.isRequired
};

export function renderPasswordResetConfirmation(m, props = {}) {
  props.closeHandler = closeLock;
  props.key = 'auxiliarypane';
  props.lock = m;

  return m.get('passwordResetted') ? <PasswordResetConfirmation {...props} /> : null;
}
