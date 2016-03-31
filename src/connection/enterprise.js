import * as l from '../lock/index';
import { dataFns } from '../utils/data_utils';
import { emailDomain } from '../field/email';
import { getFieldValue } from '../field/index';

const { tget, tset } = dataFns(["enterprise"]);


export function initEnterprise(m, opts) {
  // TODO: process options.
  return m;
}

export function isSSODomain(m, email, strategies = []) {
  // NOTE: it could just read the email from m
  const domain = emailDomain(email);
  return l.getEnabledConnections(m, "enterprise", ...strategies).some(x => (
    // TODO: `domain` seems to be always in the `domain_aliases` list,
    // so the `push` here might be unnecessary
    x.get("domain_aliases").push(x.get("domain")).contains(domain)
  ));
}

export function ssoDomain(m) {
  return isSingleHRDConnection(m)
    ? l.getEnabledConnections(m, "enterprise").getIn([0, "domain"])
    : emailDomain(getFieldValue(m, "email"));
}

// ad / adldap

export function isADEnabled(m) {
  return l.getEnabledConnections(m, "enterprise", "ad", "auth0-adldap").count() > 0;
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
