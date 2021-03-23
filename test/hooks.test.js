import * as h from './helper/ui';
import en from '../src/i18n/en';

describe('executing public hooks', () => {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe('when a hook has been defined', function() {
    it('should run the hook on login', function(done) {
      const options = {
        rememberLastLogin: false,
        hooks: {
          loggingIn: function() {
            done();
          }
        }
      };

      const lock = h.displayLock("test", options, () => {
        h.fillEmailInput(lock, 'test@test.com');
        h.fillPasswordInput(lock, 'anypass');
        h.submit(lock);
      });
    });

    it('should not run a hook that Lock does not know about', function(done) {
      const options = {
        rememberLastLogin: false,
        hooks: {
          someOtherHook: function() {
            throw 'Should not run this';
          }
        }
      };

      const lock = h.displayLock('test', options, () => {
        h.fillEmailInput(lock, 'test@test.com');
        h.fillPasswordInput(lock, 'anypass');
        h.submit(lock);
        expect(h.hasErrorMessage(lock)).not.to.be.ok();
        done();
      })
    });

    it('should display the fallback error on exception', function(done) {
      const options = {
        rememberLastLogin: false,
        hooks: {
          loggingIn: function() {
            throw 'Should not run this';
          }
        }
      };

      const lock = h.displayLock('test', options, () => {
        h.fillEmailInput(lock, 'test@test.com');
        h.fillPasswordInput(lock, 'anypass');
        h.submit(lock);
        
        h.waitUntilErrorExists(lock, () => {
          console.log(h.hasErrorMessage(lock, en.error.login['lock.fallback']));
          lock.hide();
          done();
        }, 1000)
      })
    });

    it('should display the custom error on exception', function(done) {
      const options = {
        rememberLastLogin: false,
        hooks: {
          loggingIn: function() {
            throw { code: 'hook_error', description: 'This is a custom error' };
          }
        }
      };

      const lock = h.displayLock('test', options, () => {
        h.fillEmailInput(lock, 'test@test.com');
        h.fillPasswordInput(lock, 'anypass');
        h.submit(lock);
        
        h.waitUntilErrorExists(lock, () => {
          console.log(h.hasErrorMessage(lock, 'This is a custom error'));
          lock.hide();
          done();
        }, 1000)
      })
    });
  });
});
