import { Mode } from '../index';
import render from './render';


export default class Emailcode extends Mode {

  constructor() {
    super("emailcode");
  }

  processOpenOptions(options) {
    options.modeOptions.send = "code";
    return options;
  }

  render(lock) {
    return render(lock);
  }

}
