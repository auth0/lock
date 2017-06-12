import { setField } from './index';
import { validateEmail } from './email';
import { databaseConnection } from '../connection/database';
import trim from 'trim';

const DEFAULT_CONNECTION_VALIDATION = { username: { min: 1, max: 15 } };
const regExp = /^[a-zA-Z0-9_]+$/;

function validateUsername(str, validateFormat, settings = DEFAULT_CONNECTION_VALIDATION.username) {
  // If the connection does not have validation settings, it should only check if the field is empty.
  // validateFormat overrides this logic to disable validation on login (login should never validate format)
  if (!validateFormat || settings == null) {
    return trim(str).length > 0;
  }

  const lowercased = trim(str.toLowerCase());

  // chekc min value matched
  if (lowercased.length < settings.min) {
    return false;
  }

  // check max value matched
  if (lowercased.length > settings.max) {
    return false;
  }

  // check allowed characters matched
  const result = regExp.exec(lowercased);
  return result && result[0];
}

export function getUsernameValidation(m) {
  const usernameValidation = databaseConnection(m).getIn(['validation', 'username']);
  return usernameValidation ? usernameValidation.toJS() : null;
}

export function setUsername(m, str, usernameStyle = 'username', validateUsernameFormat = true) {
  const usernameValidation = validateUsernameFormat ? getUsernameValidation(m) : null;

  const validator = value => {
    switch (usernameStyle) {
      case 'email':
        return validateEmail(value);
      case 'username':
        return validateUsername(value, validateUsernameFormat, usernameValidation);
      default:
        return usernameLooksLikeEmail(value)
          ? validateEmail(value)
          : validateUsername(value, validateUsernameFormat, usernameValidation);
    }
  };

  return setField(m, 'username', str, validator);
}

export function usernameLooksLikeEmail(str) {
  return str.indexOf('@') > -1;
}
