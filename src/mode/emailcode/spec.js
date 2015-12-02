import { Mode } from '../index';
import AskEmail from '../../passwordless/ask_email';
import AskEmailVcode from '../../passwordless/ask_email_vcode';
import { initPasswordless, passwordlessStarted } from '../../passwordless/index';

export default class Emailcode extends Mode {

  constructor() {
    super("emailcode");
  }

  willOpen(model, options) {
    this.setModel(initPasswordless(model, {send: "code"}));
  }

  render(lock) {
    return passwordlessStarted(lock)
      ? new AskEmailVcode()
      : new AskEmail();
  }

}
