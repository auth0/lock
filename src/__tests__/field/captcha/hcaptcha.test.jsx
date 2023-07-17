import React from 'react';
import { shallow } from 'enzyme';
import I from 'immutable';

import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

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

describe('hCaptcha', () => {
  it('should match the snapshot', () => {
    const mockLock = createLockMock({ provider: 'hcaptcha', sitekey: 'mySiteKey' });
    const wrapper = shallow(
      <ThirdPartyCaptcha provider={'hcaptcha'} lock={mockLock} sitekey={'mySiteKey'} />
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
      ThirdPartyCaptcha.loadScript({ hl: 'en-US', provider: 'hcaptcha' }, document.body);
      expect(document.body.innerHTML).toContain('<div id="renderTest">');
      expect(document.body.innerHTML).toContain(
        '<script src="https://js.hcaptcha.com/1/api.js?hl=en-US'
      );
    });
  });
});
