import askPhoneNumber from './ask_phone_number';
import askLocation from './ask_location';
import { sendSMS } from './actions';
import * as l from '../lock/index';
import * as m from './index';

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}
//
// function askVerificationCodeSubmitHandler(lock) {
//   signIn(lock.get("id"));
// }

export default function render(lock) {
  return {
    completed: false,
    confirmation: m.selectingLocation(lock) && askLocation,
    content: askPhoneNumber,
    disallowClose: m.selectingLocation(lock),
    submitHandler: askPhoneNumberSubmitHandler
  }
}
