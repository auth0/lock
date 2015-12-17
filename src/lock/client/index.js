import { List, Map } from 'immutable';

export function connection(m, strategyName, name) {
  const connections = strategy(m, strategyName).get("connections", List());
  return connections.find(withName(name)) || Map();
}

function strategy(m, name) {
  return m.getIn(["client", "strategies"], List()).find(withName(name))
    || Map();
}

function withName(name) {
  return x => x.get("name") === name;
}
