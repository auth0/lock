import { List } from 'immutable';
import * as l from '../core/index';
import { dataFns } from '../utils/data_utils';
import { emailDomain } from '../field/email';
import { getFieldValue } from '../field/index';

const { tget, tset } = dataFns(["enterprise"]);


export function initEnterprise(m, opts) {
  // TODO: process options.
  return m;
}

export function findSSOConnection(m, email, strategies = []) {
  // TODO: could it just read the `email` from `m`?
  const target = emailDomain(email);
  if (!domain) return false;
  return l.getEnabledConnections(m, "enterprise", ...strategies).find(x => {
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

export function isSSODomain(m, email, strategies = []) {
  return !!findSSOConnection(m, email, strategies);
}

export function ssoDomain(m) {
  return isSingleHRDConnection(m)
    ? l.getEnabledConnections(m, "enterprise").getIn([0, "domain"])
    : emailDomain(getFieldValue(m, "email"));
}

// ad / adldap

export function isADEnabled(m) {
  return l.hasSomeConnections(m, "enterprise", "ad", "auth0-adldap");
}

export function findADConnectionWithoutDomain(m) {
  l.getEnabledConnections(m, "enterprise", "ad", "auth0-adldap").find(x => (
    !x.get("domain") && x.get("domain_aliases", new List()).isEmpty()
  ));
}

// kerberos

export function isInCorpNetwork(m) {
  return m.getIn(["sso", "connection"], undefined) != undefined;
}

// hrd

export function isSingleHRDConnection(m) {
  return isADEnabled(m) && l.getEnabledConnections(m).count() === 1;
}

export function isHRDDomain(m, email) {
  return isSSODomain(m, email, ["ad", "auth0-adldap"]);
}

export function toggleHRD(m, b) {
  return tset(m, "hrd", b);
}

export function isHRDActive(m) {
  return tget(m, "hrd", false);
}
