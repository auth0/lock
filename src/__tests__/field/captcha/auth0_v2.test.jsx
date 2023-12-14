import React from 'react';
import { expectComponent } from 'testUtils';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

describe('Auth0 V2', () => {
  const component = <ThirdPartyCaptcha provider={'auth0_v2'} hl="en" sitekey={'mySiteKey'} />;

  it('should match the snapshot', () => {
    expectComponent(component).toMatchSnapshot();
  });

  it('injects the script', () => {
    const script = [...window.document.querySelectorAll('script')].find(s =>
      s.src.startsWith(
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload='
      )
    );
    expect(script).not.toBeUndefined();
  });
});
