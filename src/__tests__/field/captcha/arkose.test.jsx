import React from 'react';
import { expectComponent } from 'testUtils';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

describe('Arkose', () => {
  const component = <ThirdPartyCaptcha provider={'arkose'} hl='en' sitekey={'mySiteKey'} clientSubdomain={'client-api'} />;
  
  it('should match the snapshot', () => {
    expectComponent(component).toMatchSnapshot();
  });

  it('injects the script', () => {
    const script = [...window.document.querySelectorAll('script')].find(s => s.src.match("https://client-api.arkoselabs.com/v2/mySiteKey/api.js"));
    expect(script).not.toBeUndefined();
  });
});
