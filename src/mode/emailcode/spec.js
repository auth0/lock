import { Mode } from '../index';
import AskEmail from '../../passwordless/ask_email';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import * as m from '../../passwordless/index';

export default class Emailcode extends Mode {

  constructor() {
    super("emailcode");
  }

  willOpen(model, options) {
    options.mode.send = "code";
    this.setOptions(options);
  }

  render(lock) {
    return m.passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskEmail();
  }

}
