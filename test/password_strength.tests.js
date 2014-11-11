/* global bean, $ */

var clientID  = 'QiJzNJoKaiQdmGg9ldGYGq1BOc378fyq';
var domain    = 'lock-pwd-strength-tests.auth0.com';

function type(input, value) {
  input.val(value);
  input.focus();
  bean.fire(input[0], 'keydown');
  bean.fire(input[0], 'keyup');
  bean.fire(input[0], 'input');
}

describe('password strength', function () {
  var password;

  beforeEach(function (done) {
    this.widget = new Auth0Lock(clientID, domain);
    this.options = {
      rememberLastLogin: false,
      integratedWindowsLogin: false,
      assetsUrl: ''
      // connections: ['Username-Password-Authentication']
    };
    done();
  });

  afterEach(function (done) {
    this.options = null;
    global.window.Auth0 = null;
    this.widget.hide(done);
  });

  it('display message when password does not meet criteria', function (done) {

    this.widget.once('ready', function () {
      password  = $('#a0-lock .a0-emailPassword .a0-password input');

      expect(password).not.to.be.empty();
      expect($('#a0-lock .a0-password_policy').html()).to.be.equal('');
      // expect($('#a0-lock .a0-panel').hasClass('a0-active-pwd-strength')).to.be.equal(false);
      // expect($('#a0-lock .a0-password_policy .a0-checked').length).to.be.equal(0);

      type(password, 'hello');

      // Rules are rendered
      expect($('#a0-lock .a0-password_policy').html()).not.to.be.equal('');
      // Only the lower case rule is satisfied
      expect($('#a0-lock .a0-password_policy .a0-checked').length).to.be.equal(1);
      // TODO Panel does contain class that displays rules
      // expect($('#a0-lock .a0-panel').hasClass('a0-active-pwd-strength')).to.be.equal(true);

      done();
    });
    this.widget.showSignup(this.options);
  });

  it('should not display message when password meets criteria', function (done) {

    this.widget.once('ready', function () {
      password  = $('#a0-lock .a0-emailPassword .a0-password input');

      expect(password).not.to.be.empty();
      expect($('#a0-lock .a0-password_policy').html()).to.be.equal('');
      // expect($('.a0-panel').hasClass('a0-active-pwd-strength')).to.be.equal(false);
      // expect($('#a0-lock .a0-password_policy .a0-checked').length).to.be.equal(0);

      type(password, 'helloHELLO123!');

      // Rules are rendered
      expect($('#a0-lock .a0-password_policy').html()).not.to.be.equal('');
      // All 6 rules are satisfied
      expect($('#a0-lock .a0-password_policy .a0-checked').length).to.be.equal(6);

      // TODO Panel does not contain class that displays rules
      // expect($('.a0-panel').hasClass('a0-active-pwd-strength')).to.be.equal(false);

      done();
    });

    this.widget.showSignup(this.options);
  });
});

