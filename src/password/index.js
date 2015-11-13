export function validatePasswordOptions(options) {
  const { connection } = options;
  if (!connection || typeof connection !== "string") {
    throw new Error("The `connection` option needs to be provided.");
  }
}

export function setActivity(m, name) {
  return m.set("activity", name);
}

export function getActivity(m) {
  return m.get("activity", "login");
}
