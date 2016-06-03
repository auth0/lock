import { Map } from 'immutable';
import trim from 'trim';
import * as cc from './country_codes';
import OptionSelectionPane from './option_selection_pane';

export function setField(m, field, value, validator = str => trim(str).length > 0, ...args) {
  const prevValue = m.getIn(["field", field, "value"]);
  const prevShowInvalid = m.getIn(["field", field, "showInvalid"], false);
  const valid = validator === null || !!validator(value, ...args);

  return m.mergeIn(["field", field], Map({
    value: value,
    valid: valid,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

// TODO: this should handle icons, and everything.
// TODO: also there should be a similar fn for regular fields.
export function registerOptionField(m, field, options, initialValue) {
  let valid = true, hasInitial = !initialValue, initialOption;
  options.forEach(x => {
    valid = valid
      && x.get("label") && typeof x.get("label") === "string"
      && x.get("value") && typeof x.get("value") === "string";

    if (!hasInitial && x.get("value") === initialValue) {
      initialOption = x;
      hasInitial = true;
    }
  });

  // TODO: improve message? emit warning right here? warning for prefilled field ignored?
  if (!valid || !options.size) throw new Error(`The options provided for the "${field}" field are invalid, they must have the following format: {label: "non-empty string", value: "non-empty string"} and there has to be at least one option.`);
  if (!initialOption) initialOption = Map({});

  return m.mergeIn(["field", field], initialOption, Map({
    options: options,
    showInvalid: false,
    valid: !initialOption.isEmpty()
  }));
}

export function setOptionField(m, field, option) {
  return m.mergeIn(["field", field], option.merge(Map({
    valid: true,
    showInvalid: false
  })));
}

export function isFieldValid(m, field) {
  return m.getIn(["field", field, "valid"]);
}

export function isFieldVisiblyInvalid(m, field) {
  return m.getIn(["field", field, "showInvalid"], false)
    && !m.getIn(["field", field, "valid"]);
}

export function showInvalidField(m, field) {
  return m.setIn(["field", field, "showInvalid"], !isFieldValid(m, field));
}

// TODO: only used in passwordless, when we update it to use
// validateAndSubmit this won't be needed anymore.
export function setFieldShowInvalid(m, field, value) {
  return m.setIn(["field", field, "showInvalid"], value);
}

export function clearFields(m, fields) {
  let keyPaths;

  if (!fields || fields.length === 0) {
    keyPaths = ["field"];
  } else {
    keyPaths = fields.map(x => ["field", x]);
  }

 return keyPaths.reduce((r, v) => r.removeIn(v), m);
}

export function getField(m, field, notFound=new Map({})) {
  return m.getIn(["field", field], notFound);
}

export function getFieldValue(m, field, notFound="") {
  return getField(m, field).get("value", notFound);
}

export function getFieldLabel(m, field, notFound="") {
  return getField(m, field).get("label", notFound);
}

// phone number

export function fullPhoneNumber(lock) {
  return `${phoneDialingCode(lock) || ""}${phoneNumber(lock) || ""}`.replace(/[\s-]+/g, '');
}

export function fullHumanPhoneNumber(m) {
  const code = phoneDialingCode(m);
  const number = phoneNumber(m);
  return `${code} ${number}`;
}

export function setPhoneLocation(m, value) {
  return m.setIn(["field", "phoneNumber", "location"], value);
}

function phoneLocation(m) {
  return m.getIn(["field", "phoneNumber", "location"], cc.defaultLocation);
}

export function phoneLocationString(m) {
  return cc.locationString(phoneLocation(m));
}

export function phoneDialingCode(m) {
  return cc.dialingCode(phoneLocation(m));
}

export function phoneIsoCode(m) {
  return cc.isoCode(phoneLocation(m));
}

export function phoneNumber(lock) {
  return lock.getIn(["field", "phoneNumber", "value"], "");
}

// email

export function email(m) {
  return getFieldValue(m, "email");
}

// vcode

export function vcode(m) {
  return getFieldValue(m, "vcode");
}

// password

export function password(m) {
  return getFieldValue(m, "password");
}

// username

export function username(m) {
  return getFieldValue(m, "username");
}

// select field options

export function isSelecting(m) {
  return !!m.getIn(["field", "selecting"]);
}

export function renderOptionSelection(m) {
  const name = m.getIn(["field", "selecting", "name"]);
  return isSelecting(m)
    ? <OptionSelectionPane
         model={m}
         name={name}
         iconUrl={m.getIn(["field", "selecting", "iconUrl"])}
         items={m.getIn(["field", name, "options"])}
      />
    : null;
}
