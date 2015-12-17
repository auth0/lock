import Immutable from 'immutable';
import * as l from '../lock/index';
import * as client from '../lock/client/index';

export function initDatabase(model, options) {
  return model.setIn(
    ["database", "opts"],
    Immutable.fromJS(processDatabaseOptions(options))
  );
}

function processDatabaseOptions(options) {
  let {
    activities,
    databaseConnection,
    loginAfterSignUp,
    usernameStyle
   } = options;

  if (!databaseConnection || typeof databaseConnection !== "string") {
    throw new Error("The `databaseConnection` option needs to be provided.");
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

  return {
    activities,
    connection: databaseConnection,
    loginAfterSignUp,
    usernameStyle
   };
}

export function databaseConnection(m) {
  return m.getIn(["database", "opts", "connection"]);
}

export function setActivity(m, name) {
  return l.clearGlobalSuccess(l.clearGlobalError(m.set("activity", name)));
}

export function getActivity(m) {
  return m.get("activity", m.getIn(["database", "opts", "activities", 0]));
}

export function authWithUsername(m) {
  return m.getIn(["database", "opts", "usernameStyle"]) === "username";
}

export function hasActivity(m, s) {
  return m.getIn(["database", "opts", "activities"]).contains(s);
}

export function shouldAutoLogin(m) {
  return m.getIn(["database", "opts", "loginAfterSignUp"]);
}

export function passwordStrengthPolicy(m) {
  return client
    .connection(m, "auth0", databaseConnection(m))
    .get("passwordPolicy", "none");
}
