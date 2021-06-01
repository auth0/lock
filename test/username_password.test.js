import expect from 'expect.js';
import { Simulate } from 'react-dom/test-utils';
import webApi from '../src/core/web_api';
import * as h from './helper/ui';

describe.only('UsernamePassword login', () => {
  let lock;

  before(h.stubWebApis);
  after(h.restoreWebApis);

  beforeEach(done => {
    const opts = {
      rememberLastLogin: false
    };

    lock = h.displayLock('all', opts, done);
  });

  afterEach(() => {
    lock.hide();
  });

  it('does not call the API multiple times when pressing the enter key', done => {
    h.fillEmailInput(lock, 'test@test.te');
    h.fillPasswordInput(lock, 'anypass');

    const emailInput = h.qInput(lock, 'email', true);
    Simulate.focus(emailInput);

    let i = 0;
    expect(webApi.logIn.callCount).to.equal(0);

    let interval = setInterval(() => {
      if (i === 3) {
        console.log('Breaking');
        clearInterval(interval);
        expect(webApi.logIn.callCount).to.equal(1);
        done();
        return;
      }

      console.log('Hitting enter...');
      // Simulate.keyDown(emailInput, { key: 'Enter', keyCode: 13, which: 13 });
      // h.submit(lock);
      const ke = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13
      });

      emailInput.dispatchEvent(ke);
      i++;
    }, 5);
  });
});
