import * as l from '../lock/index';

export function initEnterprise(m, opts) {
  // TODO: process options.
  return m;
}

// ad / adldap

export function isADEnabled(m) {
  return l.getEnabledConnections(m, "enterprise", "ad", "auth0-adldap").count() > 0;
}

// export function isOnlyOneADEnabled(m) {
//   return l.getEnabledConnections(m, "enterprise", "ad", "auth0-adldap").count() === 1;
// }

// kerberos

export function isInCorpNetwork(m) {
  return m.getIn(["sso", "connection"], undefined) != undefined;
}
