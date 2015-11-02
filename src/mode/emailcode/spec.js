import { Mode } from '../index';
import AskEmail from '../../passwordless/ask_email';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import * as m from '../../passwordless/index';

export default class Emailcode extends Mode {

  constructor() {
    super("emailcode");
  }

  processOpenOptions(options) {
    options.modeOptions.send = "code";
    return options;
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskEmailVcode(lock)
      : new AskEmail(lock);
  }

}
