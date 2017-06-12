import expect from 'expect.js';
import webApi from '../src/core/web_api';
import * as h from './helper/ui';

describe("regression", function() {
    before(h.stubWebApis);
    after(h.restoreWebApis);

    beforeEach(function(done) {
        const opts = {
            rememberLastLogin: false
        };

        this.lock = h.displayLock("all", opts, done);
    });

    afterEach(function() {
        this.lock.hide();
    });

    it("does not attempt to log in with an empty email input", function() {
        h.fillEmailInput(this.lock, 'test@test.te');
        h.fillEmailInput(this.lock, '');
        h.fillPasswordInput(this.lock, 'anypass');

        h.submit(this.lock);

        expect(webApi.logIn.callCount).to.equal(0);
    });
});
