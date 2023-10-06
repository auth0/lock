import React from 'react';
import { expectComponent } from 'testUtils';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

describe('Recaptcha v2', () => {
  const component = <ThirdPartyCaptcha provider={'recaptcha_v2'} hl='en' sitekey={'mySiteKey'} />;
  
  it('should match the snapshot', () => {
    expectComponent(component).toMatchSnapshot();
  });

  it('injects the script', () => {
    const script = [...window.document.querySelectorAll('script')].find(s => s.src.startsWith("https://www.recaptcha.net/recaptcha/api.js"));
    expect(script).not.toBeUndefined();
  });
});
