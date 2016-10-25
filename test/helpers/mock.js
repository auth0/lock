export function mockModule(module, cb) {
  // horrible hack to avoid the transpilation process to assume
  // the second argument is not a function ¯\_(ツ)_/¯
  jest.mock(`../../src/${module}`, () => cb());
}

export function es6Exports(exports) {
  exports.__esModule = true;
  return exports;
}