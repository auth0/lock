import React from 'react';
import { shallow } from 'enzyme';
import I from 'immutable';

import RecaptchaV2, { render } from '../../../field/captcha/recaptchav2';

const createLockMock = ({ provider = 'none', siteKey = '' } = {}) =>
  I.fromJS({
    id: '__lock-id__',
    core: {
      captcha: { provider, siteKey },
      transient: {
        ui: {
          language: 'en-US'
        }
      }
    }
  });

describe('RecaptchaV2', () => {
  it('should match the snapshot', () => {
    const mockLock = createLockMock({ provider: 'recaptchav2', siteKey: 'mySiteKey' });
    const wrapper = shallow(<RecaptchaV2 lock={mockLock} siteKey={'mySiteKey'} />);
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
      const mockLock = createLockMock({ provider: 'recaptchav2', siteKey: 'mySiteKey' });
      render(mockLock, document.getElementById('renderTest'), {});
      expect(document.body.innerHTML).toBe(
        '<div id="renderTest"></div><script src="https://www.google.com/recaptcha/api.js?hl=en-US"></script>'
      );
    });
  });
});
