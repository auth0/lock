import React from 'react';
import { render } from '@testing-library/react';
import PasswordStrength from '../../../../ui/input/password/password_strength';

describe('PasswordStrength', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe('validatePassword()', () => {
    it(`validates password correctly with invalid password`, () => {
      const policy = {
        toJS: () => ({
          length: {
            minLength: 20
          }
        })
      };
      const messages = { foo: 'the-message' };
      const { container } = render(
        <PasswordStrength policy={policy} password="the-password" messages={messages} />
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });
});
