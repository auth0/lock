import { setField } from './index';
import { validateEmail } from './email';
import trim from 'trim';

const regExp = /^[a-zA-Z0-9_]{1,15}$/;

function validateUsername(str, validateFormat) {
  if (!validateFormat) return trim(str).length > 0;

  const result = regExp.exec(trim(str.toLowerCase()));
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
