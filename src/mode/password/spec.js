import { Mode } from '../index';
import AskEmailAndPassword from '../../password/ask_email_and_password';
import { validatePasswordOptions } from '../../password/index';

export default class Password extends Mode {

  constructor() {
    super("password");
  }

  willOpen(model, options) {
    validatePasswordOptions(options);
  }

  render(lock) {
    return new AskEmailAndPassword();
  }

}
