import Immutable from 'immutable';
import { getField, getFieldValue, registerOptionField, setField } from './index';
import locations from './phone-number/locations';

const locationOptions = Immutable.fromJS(
  locations.map(x => ({
    country: x[0],
    diallingCode: x[2],
    isoCode: x[1],
    label: `${x[2]} ${x[1]} ${x[0]}`,
    value: `${x[2]} ${x[1]}`
  }))
);

function findLocation(isoCode) {
  return locationOptions.find(x => x.get('isoCode') === isoCode);
}

export function initLocation(m, isoCode) {
  const location = findLocation(isoCode) || findLocation('US');
  return registerOptionField(m, 'location', locationOptions, location.get('value'));
}

export function validatePhoneNumber(str) {
  const regExp = /^[0-9]([0-9 -])*[0-9]$/;
  return regExp.test(str);
}

export function setPhoneNumber(m, str) {
  return setField(m, 'phoneNumber', str, validatePhoneNumber);
}

export function phoneNumberWithDiallingCode(m) {
  return humanPhoneNumberWithDiallingCode(m).replace(/[\s-]+/g, '');
}

export function humanPhoneNumberWithDiallingCode(m) {
  const location = getField(m, 'location');
  const code = location.get('diallingCode', '');
  const number = getFieldValue(m, 'phoneNumber', '');
  return code ? `${code} ${number}` : number;
}

export function humanLocation(m) {
  const location = getField(m, 'location');
  return `${location.get('diallingCode')} ${location.get('country')}`;
}
