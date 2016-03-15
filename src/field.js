export function getField(m, field) {
  return m.getIn(["field", field, "value"]);
}
