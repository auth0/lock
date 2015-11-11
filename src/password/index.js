export function validatePasswordOptions(options) {
  const { connection } = options;
  if (!connection || typeof connection !== "string") {
    throw new Error("The `connection` option needs to be provided.");
  }
}
