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

  const availableActivities = ["login", "signUp", "resetPassword"];
  const activities = options.activities === undefined
    ? availableActivities
    : options.activities;

  if (!Array.isArray(activities) || activities.length === 0) {
    throw new Error("When provided, the `activities` option array needs to contain at least one activity.");
  }

  const validActivities = activities.filter(x => availableActivities.indexOf(x) > -1);
  if (validActivities.length === 0) {
    throw new Error("When provided, the `activities` option array needs to contain at least one valid activity (\"login\", \"signUp\" or \"requestPassword\").");
  }

  options.mode.activities = validActivities;

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
