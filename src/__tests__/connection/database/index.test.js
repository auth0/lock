import Immutable, { List, Map } from 'immutable';
import { databaseUsernameValue } from '../../../connection/database';

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
    const model = getModel('user@contoso.com', null, false);

    it('should get the email', () => {
      expect(databaseUsernameValue(model)).toEqual('user@contoso.com');
    });
  });

  describe('for database connection with username required', () => {
    const model = getModel('user@contoso.com', 'user', true);

    it('should get the username when `emailFirst` is not set', () => {
      expect(databaseUsernameValue(model)).toEqual('user');
    });
    it('should get the username when `emailFirst` is false', () => {
      expect(databaseUsernameValue(model, { emailFirst: false })).toEqual('user');
    });
    it('should get the email when `emailFirst` is true', () => {
      expect(databaseUsernameValue(model, { emailFirst: true })).toEqual('user@contoso.com');
    });

    describe('and only email address is filled in', () => {
      const model = getModel('user@contoso.com', null, true);

      it('should get the email address', () => {
        expect(databaseUsernameValue(model)).toEqual('user@contoso.com');
      });
    });
  });
});
