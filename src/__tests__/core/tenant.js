const getInitTenant = () => require('core/tenant/index').initTenant;

const CLIENT_ID = 'client_id';

const runTest = (initTenant, mockDataFns, client) => {
  initTenant({}, CLIENT_ID, client);
  expect(mockDataFns.initNS.mock.calls.length).toBe(1);
  const tenantInfo = mockDataFns.initNS.mock.calls[0][1].toJS();
  expect(tenantInfo).toMatchSnapshot();
};

describe('initTenant()', () => {
  let initTenant;
  let mockDataFns;
  beforeEach(() => {
    jest.resetModules();

    mockDataFns = {
      initNS: jest.fn(),
      get: jest.fn()
    };
    jest.mock('utils/data_utils', () => ({
      dataFns: () => mockDataFns
    }));

    jest.mock('core/index', () => ({
      findConnection: jest.fn()
    }));
    initTenant = getInitTenant();
  });
  describe('with database connection', () => {
    it('maps connection correctly with defaults', () => {
      const client = {
        connections: {
          database: [
            {
              name: 'test-connection-database',
              strategy: 'auth0'
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
    it('maps connection correctly with all the properties', () => {
      const client = {
        connections: {
          database: [
            {
              allowForgot: false,
              allowSignup: false,
              name: 'test-connection-database',
              requiresUsername: true,
              strategy: 'auth0',
              validation: {
                passwordPolicy: 'test-passwordPolicy',
                username: {
                  min: 4,
                  max: 5
                }
              }
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
    it('fixes validation when values are not numbers', () => {
      const client = {
        connections: {
          database: [
            {
              allowForgot: false,
              allowSignup: false,
              name: 'test-connection-database',
              requiresUsername: true,
              strategy: 'auth0',
              validation: {
                passwordPolicy: 'test-passwordPolicy',
                username: {
                  min: 'foo',
                  max: 'bar'
                }
              }
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
    it('fixes validation when username.min > username.max', () => {
      const client = {
        connections: {
          database: [
            {
              allowForgot: false,
              allowSignup: false,
              name: 'test-connection-database',
              requiresUsername: true,
              strategy: 'auth0',
              validation: {
                passwordPolicy: 'test-passwordPolicy',
                username: {
                  min: 5,
                  max: 4
                }
              }
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
  });
  describe('with enterprise connection', () => {
    it('maps connection correctly', () => {
      const client = {
        connections: {
          enterprise: [
            {
              name: 'test-connection-enterprise',
              domains: 'domains',
              strategy: 'auth0'
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
  });
  describe('with other connection types', () => {
    it('maps connection correctly', () => {
      const client = {
        connections: {
          social: [
            {
              name: 'test-connection-other_type',
              strategy: 'auth0'
            }
          ],
          unknown: [
            {
              name: '??',
              strategy: '??'
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
  });
  describe('with passwordless connection', () => {
    it('maps connection correctly', () => {
      const client = {
        connections: {
          passwordless: [
            {
              name: 'sms',
              strategy: 'sms'
            }
          ]
        }
      };
      runTest(initTenant, mockDataFns, client);
    });
  });
  test('filters clientConnections', () => {
    const client = {
      connections: {
        database: [
          {
            name: 'test-connection-database',
            strategy: 'auth0'
          },
          {
            name: 'test-not-this-one',
            strategy: 'auth0'
          }
        ]
      },
      clientsConnections: {
        [CLIENT_ID]: ['test-connection-database']
      }
    };
    runTest(initTenant, mockDataFns, client);
  });
});
