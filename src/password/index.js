import * as l from '../lock/index';

function validatePasswordOptions(options) {
  const { connection } = options;
  if (!connection || typeof connection !== "string") {
    throw new Error("The `connection` option needs to be provided.");
  }
}

export function processPasswordOptions(options) {
  validatePasswordOptions(options);

  options.mode.usernameStyle = options.usernameStyle === "username"
    ? "username"
    : "email";

  return options;
}

export function setActivity(m, name) {
  return m.set("activity", name);
}

export function getActivity(m) {
  return m.get("activity", "login");
}

export function authWithUsername(m) {
  return l.modeOptions(m).get("usernameStyle") === "username";
}
