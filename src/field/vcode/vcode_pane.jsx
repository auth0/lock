import React from 'react';
import VcodeInput from '../../ui/input/vcode_input';
import * as l from '../../core/index';
import * as c from '../index';
import { isSmallScreen } from '../../utils/media_utils';
import { swap, updateEntity } from '../../store/index';
import { setVcode } from '../vcode';


// TODO: this should be in the passwordless ns
import { restart } from '../../passwordless/actions';

export default class VcodePane extends React.Component {

  handleVcodeChange(e) {
    e.preventDefault();
    swap(updateEntity, "lock", l.id(this.props.lock), setVcode, e.target.value);
  }

  handleResendClick(e) {
    e.preventDefault();
    restart(l.id(this.props.lock));
  }

  render() {
    const { lock, placeholder, resendLabel } = this.props;

    return (
      <div>
        <VcodeInput value={c.vcode(lock)}
          isValid={!c.isFieldVisiblyInvalid(lock, "vcode") && !l.globalError(lock)}
          onChange={::this.handleVcodeChange}
          autoFocus={!isSmallScreen()}
          placeholder={placeholder}
          disabled={l.submitting(lock)}
        />
        <p className="auth0-lock-alternative">
          <a
            className="auth0-lock-alternative-link"
            href="#"
            onClick={::this.handleResendClick}
          >
            {resendLabel}
          </a>
        </p>
      </div>
    );
  }

}

VcodePane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  resendLabel: React.PropTypes.string.isRequired
};
