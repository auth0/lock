function getDefaultStrategy(client) {
  return client.get("strategies").find((strategy) => {
    return strategy.get("name") === "auth0";
  });
}

function getDefaultConnection(client) {
  var defaultStrategy = getDefaultStrategy(client);
  return defaultStrategy && defaultStrategy.getIn(["connections", 0]);
}

// TODO is this idiomatic?
export default {
  getDefaultConnection: getDefaultConnection,
  getDefaultStrategy: getDefaultStrategy
};
