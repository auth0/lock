import PropTypes from 'prop-types';
import React from 'react';
import MFACodeInput from '../../ui/input/mfa_code_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setMFACode, getMFACodeValidation } from '../mfa_code';

export default class MFACodePane extends React.Component {
  handleChange(e) {
    const { lock } = this.props;
    swap(updateEntity, 'lock', l.id(lock), setMFACode, e.target.value);
  }

  render() {
    const { i18n, lock, placeholder } = this.props;

    return (
      <MFACodeInput
        value={c.getFieldValue(lock, 'mfa_code')}
        invalidHint={i18n.str('mfaCodeErrorHint', getMFACodeValidation().length)}
        isValid={!c.isFieldVisiblyInvalid(lock, 'mfa_code')}
        onChange={::this.handleChange}
        placeholder={placeholder}
      />
    );
  }
}

MFACodePane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired
};
