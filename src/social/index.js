import Immutable from 'immutable';
import * as l from '../lock/index';

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

export function initSocial(model, options) {
  return model.setIn(
    ["social", "opts"],
    Immutable.fromJS(processSocialOptions(options))
  );
}

export function displayName(connection) {
  return STRATEGIES[connection.strategy];
}

function processConnections(options) {

  const { connections } = options;

  if (!Array.isArray(connections) || connections.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }

  const formattedConnections = connections.reduce((r, x) => {
    if (typeof x === "string") {
      if (!STRATEGIES[x]) {
        l.warn(options, `An unknown "${x}" connection was provided.`);
        return r;
      }
      return r.concat({name: x, strategy: x});
    } else if (typeof x === "object" && typeof x.name === "string" && typeof x.strategy === "string") {
      if (!STRATEGIES[x.strategy]) {
        l.warn(options, `A connection with an unknown "${x.strategy}" strategy was provided.`);
        return r;
      }
      return r.concat(x);
    } else {
      l.warn(options, "A connection with an invalid format was provided. It must be a string or an object with name and strategy properties.");
      return r;
    }
  }, []);

  if (formattedConnections.length === 0) {
    throw new Error("The `connections` option must contain at least one valid connection.");
  }

  // TODO: check for repeated connections

  return formattedConnections;
}

function processSocialOptions(options) {
  let { socialBigButtons } = options;

  const connections = processConnections(options);

  socialBigButtons = socialBigButtons === undefined
    ? connections.length <= 3
    : socialBigButtons;

  return { connections, socialBigButtons };
}

export function socialConnections(m) {
  // TODO: not sure if returning a js object here is a good idea
  return m.getIn(["social", "opts", "connections"]).toJS();
}

export function useBigButtons(m) {
  return m.getIn(["social", "opts", "socialBigButtons"]);
}
