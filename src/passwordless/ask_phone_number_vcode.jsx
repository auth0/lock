import Base from './ask_vcode';
import * as c from '../cred/index';

export default class AskPhoneNumberVcode extends Base {

  renderHeaderText() {
    return this.t(["headerText"], {phoneNumber: c.fullHumanPhoneNumber(this.lock)});
  }

}
