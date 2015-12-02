import Immutable from 'immutable';
import * as l from '../lock/index';

export function initPassword(model, options) {
  return model.setIn(
    ["password", "opts"],
    Immutable.fromJS(processPasswordOptions(options))
  );
}

function processPasswordOptions(options) {
  console.log("options", options);
  let { activities, connection, loginAfterSignUp, usernameStyle } = options;

  if (!connection || typeof connection !== "string") {
    throw new Error("The `connection` option needs to be provided.");
  }

  usernameStyle = usernameStyle === "username" ? "username" : "email";

  const availableActivities = ["login", "signUp", "resetPassword"];
  activities = activities === undefined ? availableActivities : activities;

  if (!Array.isArray(activities) || activities.length === 0) {
    throw new Error("When provided, the `activities` option array needs to contain at least one activity.");
  }

  activities = activities.filter(x => availableActivities.indexOf(x) > -1);
  if (activities.length === 0) {
    throw new Error("When provided, the `activities` option array needs to contain at least one valid activity (\"login\", \"signUp\" or \"requestPassword\").");
  }

  loginAfterSignUp = loginAfterSignUp === false ? false : true;

  return { activities, connection, loginAfterSignUp, usernameStyle };
}

export function databaseConnection(m) {
  return m.getIn(["password", "opts", "connection"]);
}

export function setActivity(m, name) {
  return m.set("activity", name);
}

export function getActivity(m) {
  return m.get("activity", m.getIn(["password", "opts", "activities", 0]));
}

export function authWithUsername(m) {
  return m.getIn(["password", "opts", "usernameStyle"]) === "username";
}

export function hasActivity(m, s) {
  return m.getIn(["password", "opts", "activities"]).contains(s);
}

export function shouldAutoLogin(m) {
  return m.getIn(["password", "opts", "loginAfterSignUp"]);
}
