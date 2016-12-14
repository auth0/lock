"use strict";
import { stub } from 'sinon';

import expect from 'expect.js';

import {extractTenantBaseUrlOption} from '../src/core/index';

describe("extractTenantBaseUrlOption", () => {

  it('should return the configurationBaseUrl', () => {

    var url = extractTenantBaseUrlOption({
      configurationBaseUrl: 'https://test.com'
    }, 'me.auth0.com');

    expect(url).to.be('https://test.com/info-v1.js')

  });

  it('should return the assetsUrl', () => {

    var url = extractTenantBaseUrlOption({
      assetsUrl: 'https://test.com'
    }, 'me.auth0.com');

    expect(url).to.be('https://test.com')

  });

  it('should return the cdn url', () => {

    var url = extractTenantBaseUrlOption({

    }, 'me.auth0.com');

    expect(url).to.be('https://cdn.auth0.com/tenants/v1/me.js')

  });

  it('should return the regionalized cdn url', () => {

    var url = extractTenantBaseUrlOption({

    }, 'me.eu.auth0.com');

    expect(url).to.be('https://cdn.eu.auth0.com/tenants/v1/me.js')

  });

  it('should return the instance url', () => {

    var url = extractTenantBaseUrlOption({

    }, 'auth.random.com');

    expect(url).to.be('https://auth.random.com/info-v1.js')

  });

});