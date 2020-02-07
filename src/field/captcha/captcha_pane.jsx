/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import CaptchaInput from '../../ui/input/captcha_input';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import * as captchaField from '../captcha';
import { getFieldValue, isFieldVisiblyInvalid } from '../index';

const Captcha = ({ lock, i18n, onReload }) => {
  const lockId = l.id(lock);

  function handleChange(e) {
    swap(updateEntity, 'lock', lockId, captchaField.set, e.target.value);
  }

  const captcha = l.captcha(lock);

  const placeholder =
    captcha.get('type') === 'code'
      ? i18n.str(`captchaCodeInputPlaceholder`)
      : i18n.str(`captchaMathInputPlaceholder`);

  const value = getFieldValue(lock, 'captcha');
  const isValid = !isFieldVisiblyInvalid(lock, 'captcha');

  return (
    <CaptchaInput
      lockId={lockId}
      image={captcha.get('image')}
      placeholder={placeholder}
      isValid={isValid}
      onChange={handleChange}
      onReload={onReload}
      value={value}
      invalidHint={i18n.str('blankErrorHint')}
    />
  );
};

Captcha.propTypes = {
  lock: PropTypes.object.isRequired,
  error: PropTypes.bool,
  onReload: PropTypes.func.isRequired
};

Captcha.defaultProps = {
  error: false
};

export default Captcha;
