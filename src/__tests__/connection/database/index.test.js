import Immutable, { List, Map } from 'immutable';
import { databaseUsernameValue, initDatabase } from '../../../connection/database';

describe('database/index.js', () => {
  describe('databaseUsernameValue', () => {
    const getModel = (email, username, usernameRequired) =>
      Immutable.fromJS({
        field: {
          email: {
            value: email
          },
          username: {
            value: username
          }
        },
        core: {
          transient: {
            connections: {
              database: [
                {
                  requireUsername: usernameRequired
                }
              ]
            }
          }
        }
      });

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('for database connection without username required', () => {
      const model = getModel('user@auth0.com', null, false);

      it('should get the email', () => {
        expect(databaseUsernameValue(model)).toEqual('user@auth0.com');
      });
    });

    describe('for database connection with username required', () => {
      const model = getModel('user@auth0.com', 'user', true);

      it('should get the username when `emailFirst` is not set', () => {
        expect(databaseUsernameValue(model)).toEqual('user');
      });
      it('should get the username when `emailFirst` is false', () => {
        expect(databaseUsernameValue(model, { emailFirst: false })).toEqual('user');
      });
      it('should get the email when `emailFirst` is true', () => {
        expect(databaseUsernameValue(model, { emailFirst: true })).toEqual('user@auth0.com');
      });

      describe('and only email address is filled in', () => {
        const model = getModel('user@auth0.com', null, true);

        it('should get the email address', () => {
          expect(databaseUsernameValue(model)).toEqual('user@auth0.com');
        });
      });
    });
  });
  describe('initDatabase', () => {
    describe('calls initNS with the correct additionalSignUpFields', () => {
      describe('uses the `storage` attribute', () => {
        const model = Immutable.fromJS({});
        const modelOut = initDatabase(model, {
          additionalSignUpFields: [
            {
              type: 'hidden',
              name: 'hidden_field',
              value: 'hidden_value',
              storage: 'root'
            }
          ]
        });
        const modelOutJS = modelOut.toJS();
        expect(modelOutJS.database.additionalSignUpFields).toEqual([
          {
            type: 'hidden',
            name: 'hidden_field',
            value: 'hidden_value',
            storage: 'root'
          }
        ]);
      });
      describe('with a valid hidden field', () => {
        const model = Immutable.fromJS({});
        const modelOut = initDatabase(model, {
          additionalSignUpFields: [
            {
              type: 'hidden',
              name: 'hidden_field',
              value: 'hidden_value'
            }
          ]
        });
        const modelOutJS = modelOut.toJS();
        expect(modelOutJS.field).toEqual({
          hidden_field: { showInvalid: false, valid: true, value: 'hidden_value' }
        });
        expect(modelOutJS.database.additionalSignUpFields).toEqual([
          {
            type: 'hidden',
            name: 'hidden_field',
            value: 'hidden_value'
          }
        ]);
      });
      describe('with a hidden field without a value', () => {
        const model = Immutable.fromJS({});
        const modelOut = initDatabase(model, {
          additionalSignUpFields: [
            {
              type: 'hidden',
              name: 'hidden_field'
            }
          ]
        });
        expect(modelOut.toJS().database.additionalSignUpFields.length).toBe(0);
      });
    });
  });
});
