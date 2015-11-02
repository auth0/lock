import { Mode } from '../index';
import MagiclinkScreen from '../../passwordless/magiclink';

export default class Magiclink extends Mode {

  constructor() {
    super("magiclink");
  }

  processOpenOptions(options) {
    options.mode.send = "link";
    return options;
  }

  render(lock) {
    return new MagiclinkScreen(lock);
  }

}
