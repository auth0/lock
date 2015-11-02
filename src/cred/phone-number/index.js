export function openLocationSelect(m, searchStr) {
  m = m.set("selectingLocation", true);
  if (searchStr && typeof searchStr === "string") {
    m = m.set("initialLocationSearchStr", searchStr);
  }

  return m;
}

export function closeLocationSelect(m) {
  m = m.remove("selectingLocation");
  m = m.remove("initialLocationSearchStr");

  return m;
}

export function initialLocationSearchStr(m) {
  return m.get("initialLocationSearchStr", "");
}

export function selectingLocation(m) {
  return m.get("selectingLocation", false);
}
