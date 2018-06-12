const getChrome = () => {
  return require('ui/box/chrome').default;
};

describe('Chrome', () => {
  let oldConsole;
  beforeEach(() => {
    oldConsole = console;
    global.console = { log: jest.fn() };
  });
  afterEach(() => {
    global.console = oldConsole;
  });
  it('`debug` calls console.log when __DEV__', () => {
    global.__DEV__ = true;
    const Chrome = getChrome();
    var c = new Chrome({
      contentProps: {
        model: {
          toJS: () => 'jsmodel'
        }
      }
    });

    c.debug();
    const { mock } = global.console.log;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0][0]).toBe('jsmodel');
  });
  it('`debug` does not call console.log when !__DEV__', () => {
    global.__DEV__ = false;
    const Chrome = getChrome();
    var c = new Chrome({});

    c.debug();
    const { mock } = global.console.log;
    expect(mock.calls.length).toBe(0);
  });
});
