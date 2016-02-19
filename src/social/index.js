import Immutable from 'immutable';
import * as l from '../lock/index';
import { dataFns } from '../utils/data_utils';

export const STRATEGIES = {
  "amazon": "Amazon",
  "aol": "Aol",
  "baidu": "百度",
  "box": "Box",
  "dwolla": "Dwolla",
  "ebay": "ebay",
  "exact": "Exact",
  "facebook": "Facebook",
  "fitbit": "Fitbit",
  "github": "GitHub",
  "google-openid": "Google OpenId",
  "google-oauth2": "Google",
  "instagram": "Instagram",
  "linkedin": "LinkedIn",
  "miicard": "miiCard",
  "paypal": "PayPal",
  "planningcenter": "Planning Center",
  "renren": "人人",
  "salesforce": "Salesforce",
  "salesforce-community": "Salesforce Community",
  "salesforce-sandbox": "Salesforce (sandbox)",
  "shopify": "Shopify",
  "soundcloud": "Soundcloud",
  "thecity": "The City",
  "thecity-sandbox": "The City (sandbox)",
  "thirtysevensignals": "37 Signals",
  "twitter": "Twitter",
  "vkontakte": "vKontakte",
  "windowslive": "Microsoft Account",
  "wordpress": "Wordpress",
  "yahoo": "Yahoo!",
  "yammer": "Yammer",
  "yandex": "Yandex",
  "weibo": "新浪微博"
};

const { get, initNS } = dataFns(["social"]);

export function initSocial(m, options) {
  return initNS(m, Immutable.fromJS(processSocialOptions(options)));
}

export function displayName(connection) {
  return STRATEGIES[connection.strategy];
}

function processSocialOptions(options) {
  let { socialBigButtons } = options;
  // TODO: validate socialBigButtons
  return { socialBigButtons: socialBigButtons };
}

export function socialConnections(m) {
  // TODO: not sure if returning a js object here is a good idea
  const xs = l.getEnabledConnections(m, "social");
  return xs ? xs.toJS() : [];
}

export function useBigButtons(m) {
  const b = get(m, "socialBigButtons");
  return b === undefined
    ? socialConnections(m).length <= 3
    : b;
}
