import { List, Map } from 'immutable';
// TODOL this module should depend from social stuff
import { STRATEGIES as SOCIAL_STRATEGIES } from '../../connection/social/index';
import { STRATEGIES as ENTERPRISE_STRATEGIES } from '../../connection/enterprise';

export function hasFreeSubscription(m) {
  return ["free", "dev"].indexOf(m.get("subscription")) > -1;
}

export function connection(m, strategyName, name) {
  // TODO: this function should take a client, not a map with a client
  // key.
  const connections = strategy(m, strategyName).get("connections", List());
  return connections.find(withName(name)) || Map();
}

function strategy(m, name) {
  // TODO: this function should take a client, not a map with a client
  // key.
  return m.getIn(["client", "strategies"], List()).find(withName(name))
    || Map();
}

function withName(name) {
  return x => x.get("name") === name;
}

function strategyNameToConnectionType(str) {
  if (str === "auth0") {
    return "database";
  } else if (str === "email" || str === "sms") {
    return "passwordless";
  } else if (SOCIAL_STRATEGIES[str]) {
    return "social";
  } else if (ENTERPRISE_STRATEGIES[str]) {
    return "enterprise";
  } else {
    return "unknown";
  }
}

export function pickConnections(m, strs) {
  // NOTE: relevant m schema
  //
  // strategies: [
  //  {name: "strategy", connections: [{name: "connection"}]}
  // ]

  const order = strs.count() === 0
    ? _ => 0
    : c => strs.indexOf(c.get("name"));

  const strategies = m.get("strategies", List()).flatMap(s => {
    return s.get("connections")
      .filter(c => order(c) >= 0)
      .map(c => {
        return c.set("strategy", s.get("name"))
          .set("type", strategyNameToConnectionType(s.get("name")));
      });
  })

  return strategies
    .sort((c1, c2) => order(c1) - order(c2))
    .groupBy(c => c.get("type"));
}
