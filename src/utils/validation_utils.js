import trim from 'trim';

export function validateEmail(str) {
  const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = regExp.exec(trim(str.toLowerCase()));
  return result && result[0];
}

export function validateUsername(username) {
  return trim(username).length > 0;
}
