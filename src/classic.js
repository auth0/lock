import Base from './index';
import ClassicPlugin from './plugin/classic/plugin.js';

Base.plugins.register(ClassicPlugin);

export default class Auth0Lock extends Base {

  constructor(...args) {
    super("classic", ...args);
  }

}
