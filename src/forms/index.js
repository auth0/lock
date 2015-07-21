export function countryCode(lock) {
  return lock.getIn(["credentials", "phoneNumber", "countryCode"]);
}

export function setCountryCode(lock, countryCode) {
  return lock.setIn(["credentials", "phoneNumber", "countryCode"], countryCode);
}


export function phoneNumber(lock) {
  return lock.getIn(["credentials", "phoneNumber", "number"]);
}

export function fullPhoneNumber(lock) {
  return `${countryCode(lock)}${phoneNumber(lock)}`;
}

export function validPhoneNumber(lock) {
  const validate = lock.getIn(["credentials", "phoneNumber", "validate"]);
  const valid = lock.getIn(["credentials", "phoneNumber", "valid"]);
  return  validate && valid;
}
