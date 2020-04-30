/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import CaptchaInput from '../../ui/input/captcha_input';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import * as captchaField from '../captcha';
import { getFieldValue, isFieldVisiblyInvalid } from '../index';
import RecaptchaV2 from './recaptchav2';

export default class CaptchaPane extends React.Component {
  render() {
    const { i18n, lock, onReload } = this.props;

    const lockId = l.id(lock);

    function handleChange(e) {
      swap(updateEntity, 'lock', lockId, captchaField.set, e.target.value);
    }

    const captcha = l.captcha(lock);

    if (captcha.get('provider') === 'recaptcha_v2') {
      return <RecaptchaV2 lock={lock} siteKey={captcha.get('siteKey')} />;
    }

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
  }
}

CaptchaPane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  error: PropTypes.bool,
  onReload: PropTypes.func.isRequired
};

CaptchaPane.defaultProps = {
  error: false
};
