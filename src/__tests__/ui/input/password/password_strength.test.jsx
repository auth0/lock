import React from 'react';
import { mount } from 'enzyme';
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
      const wrapper = mount(
        <PasswordStrength policy={policy} password="the-password" messages={messages} />
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
