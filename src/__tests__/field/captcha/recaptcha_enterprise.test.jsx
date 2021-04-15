import React from 'react';
import { shallow } from 'enzyme';
import I from 'immutable';

import { ReCAPTCHA } from '../../../field/captcha/recaptcha';

const createLockMock = ({ provider = 'none', sitekey = '' } = {}) =>
  I.fromJS({
    id: '__lock-id__',
    core: {
      captcha: { provider, sitekey },
      transient: {
        ui: {
          language: 'en-US'
        }
      }
    }
  });

describe('Recaptcha Enterprise', () => {
  it('should match the snapshot', () => {
    const mockLock = createLockMock({ provider: 'recaptcha_enterprise', sitekey: 'mySiteKey' });
    const wrapper = shallow(
      <ReCAPTCHA provider={'recaptcha_enterprise'} lock={mockLock} sitekey={'mySiteKey'} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  describe('render', () => {
    beforeAll(() => {
      document.body.innerHTML = "<div id='renderTest'></div>";
    });
    afterAll(() => {
      document.getElementById('renderTest').remove();
    });
    it('injects the script', () => {
      ReCAPTCHA.loadScript({ hl: 'en-US', provider: 'recaptcha_enterprise' }, document.body);
      expect(document.body.innerHTML).toContain('<div id="renderTest">');
      expect(document.body.innerHTML).toContain(
        '<script src="https://www.google.com/recaptcha/enterprise.js?render=explicit'
      );
    });
  });
});
