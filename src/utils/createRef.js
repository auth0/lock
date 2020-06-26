/**
 * This is similar to React.createRef(),
 * the current version of this library doesn't support it.
 * @returns {function} the ref func
 */
export function createRef() {
  const f = function(element) {
    f.current = element;
  };
  return f;
}
