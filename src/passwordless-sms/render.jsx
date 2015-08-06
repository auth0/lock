import askPhoneNumber from './ask_phone_number';
//import { requestPasswordlessSMS, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';

// function askPhoneNumberSubmitHandler(lock) {
//   requestPasswordlessSMS(lock.get("id"));
// }
//
// function askVerificationCodeSubmitHandler(lock) {
//   signIn(lock.get("id"));
// }

export default function render(lock) {
  return {
    completed: false,
    confirmation: null,
    content: askPhoneNumber,
    submitHandler: () => { console.log ("submitHanlder"); }
  }
}
