import { setField } from './index';
import { validateEmail } from './email';
import trim from 'trim';

const regExp = /^[a-zA-Z0-9_]+$/;

function validateUsername(str, validateFormat, settings = { min: 1, max: 15 }) {
  if (!validateFormat) {
    return trim(str).length > 0;
  }

  const lowercased = trim(str.toLowerCase());

  // chekc min value matched
  if (lowercased.length <= settings.min) {
    return false;
  }

  // check max value matched
  if (lowercased.length >= settings.max) {
    return false;
  }

  // check allowed characters matched
  const result = regExp.exec(lowercased);
  return result && result[0];
}

export function setUsername(m, str, usernameStyle = "username", validateUsernameFormat = true) {

  const validator = value => {
    switch(usernameStyle) {
    case "email":
      return validateEmail(value);
    case "username":
      return validateUsername(value, validateUsernameFormat);
    default:
      return usernameLooksLikeEmail(value)
        ? validateEmail(value)
        : validateUsername(value, validateUsernameFormat);
    }
  };

  return setField(m, "username", str, validator);
}

export function usernameLooksLikeEmail(str) {
  return str.indexOf("@") > -1;
}
