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

export function displayName(connection) {
  return STRATEGIES[connection.strategy];
}

export function validateSocialOptions(options) {
  const { connections } = options;
  if (!Array.isArray(connections) || connections.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }

  connections.forEach(x => {
    if (typeof x === "string") {
      if (!STRATEGIES[x]) {
        throw new Error(`An unknown "${x}" connection was provided.`);
      }
    } else if (typeof x === "object" && typeof x.name === "string" && typeof x.strategy === "string") {
      if (!STRATEGIES[x.strategy]) {
        throw new Error(`A connection with an unknown "${x.strategy}" strategy was provided.`);
      }
    } else {
      throw new Error("A connection with an invalid format was provided. It must be a string or an object with name and strategy properties.");
    }
  });
}

export function processSocialOptions(options) {
  validateSocialOptions(options);

  const { connections, socialBigButtons } = options;

  options.connections = connections.map(x => (
    typeof x === "string" ? {name: x, strategy: x} : x
  ));

  options.mode.socialBigButtons = socialBigButtons === undefined
    ? connections.length <= 3
    : socialBigButtons;

  return options;
}

export function useBigButtons(m) {
  return l.modeOptions(m).get("socialBigButtons", true);
}
