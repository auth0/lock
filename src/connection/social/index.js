import Immutable from 'immutable';
import * as l from '../../core/index';
import { dataFns } from '../../utils/data_utils';

// TODO: Android version also has "unknonwn-social", "evernote" and
// "evernote-sandbox""evernote" in the list, considers "google-openid"
// to be enterprise and doesn't contain "salesforce-community". See
// https://github.com/auth0/Lock.Android/blob/98262cb7110e5d1c8a97e1129faf2621c1d8d111/lock/src/main/java/com/auth0/android/lock/utils/Strategies.java
export const STRATEGIES = {
  amazon: 'Amazon',
  aol: 'Aol',
  baidu: '百度',
  bitbucket: 'Bitbucket',
  box: 'Box',
  dropbox: 'Dropbox',
  dwolla: 'Dwolla',
  ebay: 'ebay',
  exact: 'Exact',
  facebook: 'Facebook',
  fitbit: 'Fitbit',
  github: 'GitHub',
  'google-openid': 'Google OpenId',
  'google-oauth2': 'Google',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  miicard: 'miiCard',
  paypal: 'PayPal',
  "paypal-sandbox": "PayPal Sandbox",
  planningcenter: 'Planning Center',
  renren: '人人',
  salesforce: 'Salesforce',
  'salesforce-community': 'Salesforce Community',
  'salesforce-sandbox': 'Salesforce (sandbox)',
  evernote: 'Evernote',
  'evernote-sandbox': 'Evernote (sandbox)',
  shopify: 'Shopify',
  soundcloud: 'Soundcloud',
  thecity: 'The City',
  'thecity-sandbox': 'The City (sandbox)',
  thirtysevensignals: '37 Signals',
  twitter: 'Twitter',
  vkontakte: 'vKontakte',
  windowslive: 'Microsoft Account',
  wordpress: 'Wordpress',
  yahoo: 'Yahoo!',
  yammer: 'Yammer',
  yandex: 'Yandex',
  weibo: '新浪微博'
};

const { get, tget, initNS } = dataFns(['social']);

export function initSocial(m, options) {
  return initNS(m, Immutable.fromJS(processSocialOptions(options)));
}

export function displayName(connection) {
  if (['oauth1', 'oauth2'].indexOf(connection.get('strategy')) !== -1) {
    return connection.get('name');
  }
  return STRATEGIES[connection.get('strategy')];
}

export function processSocialOptions(options) {
  const result = {};
  const { socialButtonStyle } = options;

  // TODO: emit warnings
  if (['big', 'small'].indexOf(socialButtonStyle) > -1) {
    result.socialButtonStyle = socialButtonStyle;
  }

  return result;
}

export function socialConnections(m) {
  return l.connections(m, 'social');
}

export function authButtonsTheme(m) {
  return l.ui.authButtonsTheme(m);
}

export function useBigButtons(m, notFoundLimit) {
  const style = tget(m, 'socialButtonStyle') || get(m, 'socialButtonStyle');
  return style ? style === 'big' : l.connections(m, 'social').count() <= notFoundLimit;
}
