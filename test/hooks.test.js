import * as h from './helper/ui';
import en from '../src/i18n/en';

describe('executing public hooks', () => {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe('when a hook has been defined', function() {
    describe('during login', function() {
      it('should run the loggingIn hook', function(done) {
        const options = {
          rememberLastLogin: false,
          hooks: {
            loggingIn: function() {
              done();
            }
          }
        };

        const lock = h.displayLock('test', options, () => {
          h.logInWithEmailAndPassword(lock, () => {
            expect(h.hasErrorMessage(lock)).not.to.be.ok();
          });
        });
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
          h.logInWithEmailAndPassword(lock, () => {
            h.waitUntilErrorExists(
              lock,
              () => {
                expect(h.hasErrorMessage(lock, 'This is a custom error')).to.be.ok();
                lock.hide();
                done();
              },
              1000
            );
          });
        });
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
          h.logInWithEmailAndPassword(lock, () => {
            h.waitUntilErrorExists(
              lock,
              () => {
                expect(h.hasErrorMessage(lock, en.error.login['lock.fallback'])).to.be.ok();
                lock.hide();
                done();
              },
              1000
            );
          });
        });
      });
    });

    describe('during signUp', function() {
      it('should run the signingUp hook', function(done) {
        const options = {
          rememberLastLogin: false,
          initialScreen: 'signUp',
          hooks: {
            signingUp: function() {
              done();
            }
          }
        };

        const lock = h.displayLock('test', options, () => {
          expect(h.isSignUpTabCurrent(lock)).to.be.ok();
          h.signUpWithEmailAndPassword(lock, () => {
            expect(h.hasErrorMessage(lock)).not.to.be.ok();
          });
        });
      });

      it('should display the custom error on exception', function(done) {
        const options = {
          rememberLastLogin: false,
          initialScreen: 'signUp',
          hooks: {
            signingUp: function() {
              throw { code: 'hook_error', description: 'This is a custom error' };
            }
          }
        };

        const lock = h.displayLock('test', options, () => {
          h.signUpWithEmailAndPassword(lock, () => {
            h.waitUntilErrorExists(
              lock,
              () => {
                expect(h.hasErrorMessage(lock, 'This is a custom error')).to.be.ok();
                lock.hide();
                done();
              },
              2000
            );
          });
        });
      });

      it('should display the fallback error on exception', function(done) {
        const options = {
          rememberLastLogin: false,
          initialScreen: 'signUp',
          hooks: {
            signingUp: function() {
              throw 'Should not run this';
            }
          }
        };

        const lock = h.displayLock('test', options, () => {
          h.signUpWithEmailAndPassword(lock, () => {
            h.waitUntilErrorExists(
              lock,
              () => {
                expect(h.hasErrorMessage(lock, en.error.signUp['lock.fallback'])).to.be.ok();
                lock.hide();
                done();
              },
              1000
            );
          });
        });
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
        h.logInWithEmailAndPassword(lock, () => {
          expect(h.hasErrorMessage(lock)).not.to.be.ok();
          done();
        });
      });
    });
  });
});
