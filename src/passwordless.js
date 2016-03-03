import Base from './index';
import PasswordlessPlugin from './plugin/passwordless/plugin.js';

Base.plugins.register(PasswordlessPlugin);

export default class Auth0LockPasswordless extends Base {

  constructor(...args) {
    super("passwordless", ...args);
  }

}
