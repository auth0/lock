import Base from './ask_email';
import { renderEmailSentConfirmation } from '../modes/shared';

export default class Magiclink extends Base {

  renderAuxiliaryPane() {
    return renderEmailSentConfirmation(this.lock);
  }

}
