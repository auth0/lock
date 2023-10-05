import React from 'react';
import { expectComponent } from 'testUtils';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

describe('Recaptcha Enterprise', () => {
  const component = <ThirdPartyCaptcha provider={'recaptcha_enterprise'} hl='en' sitekey={'mySiteKey'} />;
  
  it('should match the snapshot', () => {
    expectComponent(component).toMatchSnapshot();
  });

  it('injects the script', () => {
    const script = [...window.document.querySelectorAll('script')].find(s => s.src.startsWith("https://www.recaptcha.net/recaptcha/enterprise.js"));
    expect(script).not.toBeUndefined();
  });
});
