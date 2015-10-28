import { Mode } from '../index';
import render from './render';

export default class Magiclink extends Mode {

  constructor() {
    super("magiclink");
  }

  processOpenOptions(options) {
    options.modeOptions.send = "link";
    return options;
  }

  render(lock) {
    return render(lock);
  }

}
