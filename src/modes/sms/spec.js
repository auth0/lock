import { Mode } from '../index';
import render from './render';
import { setDefaultLocation } from '../../passwordless/actions';

export default class Sms extends Mode {

  constructor() {
    super("sms");
  }

  processOpenOptions(options, lockID) {
    options.modeOptions.send = "sms";
    const { defaultLocation } = options;
    if (defaultLocation && typeof defaultLocation === "string") {
      setDefaultLocation(lockID, defaultLocation.toUpperCase());
    }

    return options;
  }

  render(lock) {
    return render(lock);
  }

}
