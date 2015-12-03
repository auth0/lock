import React from 'react';
import VcodeInput from './vcode_input';
import * as l from '../../lock/index';
import * as c from '../index';
import { isSmallScreen } from '../../utils/media_utils';
import { changeVcode } from './actions';

// TODO: remove passwordless deps
import { back } from '../../passwordless/actions';

export default class VcodePane extends React.Component {

  handleVcodeChange(e) {
    e.preventDefault();
    changeVcode(l.id(this.props.lock), e.target.value);
  }

  handleResendClick(e) {
    e.preventDefault();
    back(l.id(this.props.lock), {clearCred: ["vcode"]});
  }

  render() {
    const { lock, placeholder, resendLabel, tabIndex } = this.props;

    return (
      <div>
        <VcodeInput value={c.vcode(lock)}
          isValid={!c.visiblyInvalidVcode(lock) && !l.globalError(lock)}
          onChange={::this.handleVcodeChange}
          autoFocus={!isSmallScreen()}
          placeholder={placeholder}
          disabled={l.submitting(lock)}
          tabIndex={l.tabIndex(lock, tabIndex)} />
        <p className="auth0-lock-did-not-receive-code">
          <a href="#" className="auth0-lock-did-not-receive-code-link" onClick={::this.handleResendClick}>
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
  resendLabel: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.number.isRequired
};

VcodePane.defaultProps = {
  tabIndex: 1
};
