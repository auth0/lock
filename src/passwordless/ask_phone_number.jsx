import Base from '../cred/phone-number/ask_phone_number';
import { sendSMS } from './actions';

export default class AskPhoneNumber extends Base {

  submitHandler() {
    return sendSMS;
  }

}
