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

    it('should get the username', () => {
      expect(databaseUsernameValue(model)).toEqual('user');
    });

    describe('and only email address is filled in', () => {
      const model = getModel('user@contoso.com', null, true);

      it('should get the email address', () => {
        expect(databaseUsernameValue(model)).toEqual('user@contoso.com');
      });
    });
  });
});
