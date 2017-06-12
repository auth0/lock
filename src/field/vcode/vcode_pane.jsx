import PropTypes from 'prop-types';
import React from 'react';
import VcodeInput from '../../ui/input/vcode_input';
import * as l from '../../core/index';
import * as c from '../index';
import { isSmallScreen } from '../../utils/media_utils';
import { swap, updateEntity } from '../../store/index';
import { setVcode } from '../vcode';

export default class VcodePane extends React.Component {
  handleVcodeChange(e) {
    e.preventDefault();
    swap(updateEntity, 'lock', l.id(this.props.lock), setVcode, e.target.value);
  }

  handleResendClick(e) {
    e.preventDefault();
    const { lock, onRestart } = this.props;
    onRestart(l.id(lock));
  }

  render() {
    const { instructions, lock, placeholder, resendLabel } = this.props;
    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <div>
        {header}
        <VcodeInput
          value={c.vcode(lock)}
          isValid={!c.isFieldVisiblyInvalid(lock, 'vcode') && !l.globalError(lock)}
          onChange={::this.handleVcodeChange}
          autoFocus={!isSmallScreen()}
          placeholder={placeholder}
          disabled={l.submitting(lock)}
        />
        <p className="auth0-lock-alternative">
          <a className="auth0-lock-alternative-link" href="#" onClick={::this.handleResendClick}>
            {resendLabel}
          </a>
        </p>
      </div>
    );
  }
}

VcodePane.propTypes = {
  instructions: PropTypes.element,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  resendLabel: PropTypes.string.isRequired,
  onRestart: PropTypes.func.isRequired
};
