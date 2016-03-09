import Base from './ask_vcode';
import * as c from '../field/index';

export default class AskEmailVcode extends Base {
  constructor() {
    super("emailCode");
  }

  renderHeaderText(lock) {
    return this.t(lock, ["headerText"], {email: c.email(lock)});
  }

}
