import React from 'react';
import { shallow } from 'enzyme';
import I from 'immutable';

import { ExtendedCaptcha } from '../../../field/captcha/extended_captcha';

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

describe('friendly captcha', () => {
  it('should match the snapshot', () => {
    const mockLock = createLockMock({ provider: 'friendly_captcha', sitekey: 'mySiteKey' });
    const wrapper = shallow(
      <ExtendedCaptcha provider={'friendly_captcha'} lock={mockLock} sitekey={'mySiteKey'} />
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
      ExtendedCaptcha.loadScript({ hl: 'en-US', provider: 'friendly_captcha' }, document.body);
      expect(document.body.innerHTML).toContain('<div id="renderTest">');
      expect(document.body.innerHTML).toContain(
        '<script src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.12/widget.min.js'
      );
    });
  });
});
