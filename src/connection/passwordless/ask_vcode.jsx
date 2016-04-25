import Base from '../../field/vcode/ask_vcode';
import { restart, logIn } from './actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

export default class AskVcode extends Base {

  backHandler() {
    return restart;
  }

  submitHandler() {
    return logIn;
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

}
