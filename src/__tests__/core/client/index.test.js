import Immutable from 'immutable';
import { initClient } from '../../../core/client';

describe('core/client/index', () => {
  describe('initClient', () => {
    ['none', 'low', 'fair', 'good', 'excellent'].forEach(policy => {
      it(`loads password policy '${policy}' correctly without a password_complexity_options option`, () => {
        const client = {
          strategies: [
            {
              name: 'auth0',
              connections: [
                {
                  name: 'Username-Password-Authentication',
                  passwordPolicy: policy
                }
              ]
            }
          ]
        };
        const result = initClient(Immutable.fromJS({}), client).toJS();
        expect(result.client.connections.database[0].passwordPolicy.length).toMatchSnapshot();
      });
      it(`loads password policy '${policy}' correctly with a password_complexity_options option`, () => {
        const client = {
          strategies: [
            {
              name: 'auth0',
              connections: [
                {
                  name: 'Username-Password-Authentication',
                  passwordPolicy: policy,
                  password_complexity_options: { min_length: 4 }
                }
              ]
            }
          ]
        };
        const result = initClient(Immutable.fromJS({}), client).toJS();
        expect(result.client.connections.database[0].passwordPolicy.length).toMatchSnapshot();
      });
    });
  });
});
