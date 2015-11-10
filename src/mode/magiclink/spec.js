import { Mode } from '../index';
import MagiclinkScreen from '../../passwordless/magiclink';

export default class Magiclink extends Mode {

  constructor() {
    super("magiclink");
  }

  willOpen(model, options) {
    options.mode.send = "link";
    this.setOptions(options);
  }

  render(lock) {
    return new MagiclinkScreen();
  }

}
