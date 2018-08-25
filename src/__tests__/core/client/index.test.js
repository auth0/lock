import Immutable from 'immutable';
import { initClient } from '../../../core/client';

describe('core/client/index', () => {
  describe('initClient', () => {
    it('loads password policy correctly without a password_complexity_options option', () => {
      const client = {
        strategies: [
          {
            name: 'auth0',
            connections: [
              {
                name: 'Username-Password-Authentication',
                passwordPolicy: 'low'
              }
            ]
          }
        ]
      };
      const result = initClient(Immutable.fromJS({}), client).toJS();
      expect(result.client.connections.database[0].passwordPolicy).toMatchObject({
        length: {
          minLength: 6
        }
      });
    });
    it('loads password policy correctly with a password_complexity_options option', () => {
      const client = {
        strategies: [
          {
            name: 'auth0',
            connections: [
              {
                name: 'Username-Password-Authentication',
                passwordPolicy: 'low',
                password_complexity_options: { min_length: 4 }
              }
            ]
          }
        ]
      };
      const result = initClient(Immutable.fromJS({}), client).toJS();
      expect(result.client.connections.database[0].passwordPolicy).toMatchObject({
        length: {
          minLength: 4
        }
      });
    });
  });
});
