import React from 'react';
import { expectComponent } from 'testUtils';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

describe('hCaptcha', () => {
  const component = <ThirdPartyCaptcha provider={'hcaptcha'} hl='en' sitekey={'mySiteKey'} />;
  
  it('should match the snapshot', () => {
    expectComponent(component).toMatchSnapshot();
  });

  it('injects the script', () => {
    const script = [...window.document.querySelectorAll('script')].find(s => s.src.startsWith("https://js.hcaptcha.com/1/api.js"));
    expect(script).not.toBeUndefined();
  });
});
