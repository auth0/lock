import askPhoneNumber from './ask_phone_number';
import askLocation from './ask_location';
import askVerificationCode from './ask_verification_code';
import { reset, sendSMS, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}

function askVerificationCodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(id) {
  reset(id);
}

export default function render(lock) {
  return {
    backHandler: m.smsSent(lock) ? backHandler : undefined,
    completed: false,
    confirmation: m.selectingLocation(lock) && askLocation,
    content: m.smsSent(lock) ? askVerificationCode : askPhoneNumber,
    disallowClose: m.selectingLocation(lock),
    submitHandler: m.smsSent(lock) ? askVerificationCodeSubmitHandler : askPhoneNumberSubmitHandler
  }
}

// TODO: rename file to render.js
