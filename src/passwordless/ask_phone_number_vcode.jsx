import Base from './ask_vcode';
import * as c from '../field/index';

export default class AskPhoneNumberVcode extends Base {
  constructor() {
    super("smsCode");
  }

  renderHeaderText(lock) {
    return this.t(lock, ["headerText"], {phoneNumber: c.fullHumanPhoneNumber(lock)});
  }

}
