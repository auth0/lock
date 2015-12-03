import Base from './ask_vcode';
import * as c from '../cred/index';

export default class AskPhoneNumberVcode extends Base {

  renderHeaderText(lock) {
    return this.t(lock, ["headerText"], {phoneNumber: c.fullHumanPhoneNumber(lock)});
  }

}
