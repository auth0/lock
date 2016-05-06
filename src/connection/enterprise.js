import Immutable, { List } from 'immutable';
import * as l from '../core/index';
import * as c from '../field/index';
import { dataFns } from '../utils/data_utils';
import { emailDomain } from '../field/email';
import { getFieldValue } from '../field/index';

const { get, initNS, tget, tset } = dataFns(["enterprise"]);

// TODO: Android version also has "google-opendid" in the list, but we
// consider it to be a social connection. See
// https://github.com/auth0/Lock.Android/blob/98262cb7110e5d1c8a97e1129faf2621c1d8d111/lock/src/main/java/com/auth0/android/lock/utils/Strategies.java
export const STRATEGIES = {
  "ad": "AD / LDAP",
  "adfs": "ADFS",
  "auth0-adldap": "AD/LDAP",
  "custom": "Custom Auth",
  "google-apps": "Google Apps",
  "ip": "IP Address",
  "mscrm": "Dynamics CRM",
  "office365": "Office365",
  "pingfederate": "Ping Federate",
  "samlp": "SAML",
  "sharepoint": "SharePoint Apps",
  "waad": "Windows Azure AD"
}

export function initEnterprise(m, opts) {
  return initNS(m, Immutable.fromJS(processOptions(opts)));
}

function processOptions(opts) {
  let { defaultEnterpriseConnection } = opts;

  if (defaultEnterpriseConnection != undefined && typeof defaultEnterpriseConnection !== "string") {
    l.warn(options, "The `defaultEnterpriseConnection` option will be ignored, because it is not a string.");
    defaultEnterpriseConnection = undefined;
  }

  return defaultEnterpriseConnection === undefined
    ? {}
    : {defaultConnectionName: defaultEnterpriseConnection};
}

export function defaultEnterpriseConnection(m) {
  const name = defaultEnterpriseConnectionName(m);
  return name && findADConnectionWithoutDomain(m, name);
}

export function defaultEnterpriseConnectionName(m) {
  return get(m, "defaultConnectionName");
}

export function enterpriseConnection(m) {
  if (isHRDActive(m)) {
    // HRD is active when an email matched or there is only one
    // connection and it is enterprise
    const email = c.email(m);
    return matchConnection(m, email) || findActiveFlowConnection(m);
  } else {
    return defaultEnterpriseConnection(m) || findADConnectionWithoutDomain(m);
  }
}

export function matchConnection(m, email, strategies = []) {
  // TODO: could it just read the `email` from `m`?
  const target = emailDomain(email);
  if (!target) return false;
  return l.connections(m, "enterprise", ...strategies).find(x => {
    // TODO: `domain` seems to be always in the `domain_aliases` list,
    // so the `push` here might be unnecessary
    const domain = x.get("domain");
    let domains = x.get("domain_aliases", new List());
    if (domain) {
      domains = domains.push(domain);
    }
    return domains.contains(target);
  });

}

export function isEnterpriseDomain(m, email, strategies = []) {
  return !!matchConnection(m, email, strategies);
}

export function enterpriseDomain(m) {
  return isSingleHRDConnection(m)
    ? l.connections(m, "enterprise").getIn([0, "domain"])
    : emailDomain(getFieldValue(m, "email"));
}

export function quickAuthConnection(m) {
  return !isADEnabled(m) && l.hasOneConnection(m, "enterprise")
    ? l.connections(m, "enterprise").get(0)
    : null;
}

// ad / adldap
// https://github.com/auth0/Lock.Android/blob/0145b6853a8de0df5e63ef22e4e2bc40be97ad9e/lock/src/main/java/com/auth0/android/lock/utils/Strategy.java#L67

export function isADEnabled(m) {
  return l.hasSomeConnections(m, "enterprise", "ad", "auth0-adldap");
}

export function findADConnectionWithoutDomain(m, name = undefined) {
  return l.connections(m, "enterprise", "ad", "auth0-adldap").find(x => {
    return !x.get("domain")
      && x.get("domain_aliases", new List()).isEmpty()
      && (!name || x.get("name") === name)
  });
}

function findActiveFlowConnection(m, name = undefined) {
  return l.connections(m, "enterprise", "ad", "auth0-adldap").find(x => {
    return !name || x.get("name") === name;
  });
}

// kerberos

export function isInCorpNetwork(m) {
  return corpNetworkConnection(m) !== undefined;
}

export function corpNetworkConnection(m) {
  // TODO: ensure there is a connection there with the expected
  // format.
  return m.getIn(["sso", "connection"]);
}

// hrd

export function isSingleHRDConnection(m) {
  return isADEnabled(m) && l.connections(m).count() === 1;
}

export function isHRDDomain(m, email) {
  return isEnterpriseDomain(m, email, ["ad", "auth0-adldap"]);
}

export function toggleHRD(m, b) {
  return tset(m, "hrd", b);
}

export function isHRDActive(m) {
  return tget(m, "hrd", isSingleHRDConnection(m));
}
