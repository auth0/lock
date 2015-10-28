import { Mode } from '../index';
import render from './render';
import { setDefaultLocation } from '../../passwordless/actions';


export default class SocialOrSms extends Mode {

  constructor() {
    super("socialOrSms");
  }

  processOpenOptions(options, lockID) {
    options.modeOptions.send = "sms";

    const { connections, defaultLocation } = options;

    if (!Array.isArray(connections) || connections.length === 0) {
      throw new Error("The `connections` option array needs to be provided with at least one connection.");
    }

    if (defaultLocation && typeof defaultLocation === "string") {
      setDefaultLocation(lockID, defaultLocation.toUpperCase());
    }

    return options;
  }

  render(lock) {
    return render(lock);
  }

}
