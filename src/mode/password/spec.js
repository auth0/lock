import { Mode } from '../index';
import Login from '../../password/login';
import SignUp from '../../password/sign_up';
import { getActivity, processPasswordOptions } from '../../password/index';

export default class Password extends Mode {

  constructor() {
    super("password");
  }

  willOpen(model, options) {
    this.setOptions(processPasswordOptions(options));
  }

  render(lock) {
    return getActivity(lock) === "login"
      ? new Login()
      : new SignUp();
  }

}
