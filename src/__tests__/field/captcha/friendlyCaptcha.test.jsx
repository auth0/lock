import React from 'react';
import { expectComponent } from 'testUtils';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

describe('friendly captcha', () => {
  const wrapper = <ThirdPartyCaptcha provider={'friendly_captcha'} hl='en' sitekey={'mySiteKey'} />;
  
  it('should match the snapshot', () => {
    expectComponent(wrapper).toMatchSnapshot();
  });

  it('injects the script', () => {
    const script = [...window.document.querySelectorAll('script')].find(s => s.src.startsWith("https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.12/widget.min.js"));
    expect(script).not.toBeUndefined();
  });
});
