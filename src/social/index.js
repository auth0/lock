export function validateSocialOptions(options) {
  const { connections } = options;
  if (!Array.isArray(connections) || connections.length === 0) {
    throw new Error("The `connections` option array needs to be provided with at least one connection.");
  }
}

export function processSocialOptions(options) {
  validateSocialOptions(options);

  const { connections, socialBigButtons } = options;

  options.mode.socialBigButtons = socialBigButtons === undefined
    ? connections.length <= 3
    : socialBigButtons;

  return options;
}
