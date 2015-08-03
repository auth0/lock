export function setDisplayName(m, value) {
  return m.set("displayName", value);
}

export function displayName(m) {
  return m.get("displayName");
}

export function setImageUrl(m, value) {
  return m.set("imageUrl", value);
}

export function imageUrl(m) {
  return m.get("imageUrl");
}

export function loaded(m) {
  return !!(displayName(m) && imageUrl(m));
}
