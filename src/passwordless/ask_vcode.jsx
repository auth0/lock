import Base from '../cred/vcode/ask_vcode';
import { back, signIn } from './actions';
import { renderSignedInConfirmation } from '../modes/shared';
import * as l from '../lock/index';

export default class AskVcode extends Base {

  backHandler() {
    // TODO: can't backHandler just take an id?
    const { lock } = this;
    return () => back(l.id(lock), {clearCred: ["vcode"]});
  }

  submitHandler() {
    return signIn;
  }

  renderAuxiliaryPane() {
    return renderSignedInConfirmation(this.lock);
  }

}
