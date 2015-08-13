import askPhoneNumber from './ask_phone_number';
import askLocation from './ask_location';
import askVerificationCode from './ask_verification_code';
import { close, reset, sendSMS, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}

function askVerificationCodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(lock) {
  reset(l.id(lock), false);
}

export default function render(lock) {
  return {
    auxiliaryPane: m.selectingLocation(lock) && askLocation,
    backHandler: m.smsSent(lock) ? backHandler : undefined,
    closeHandler: close,
    mainPane: m.smsSent(lock) ? askVerificationCode : askPhoneNumber,
    mainPaneKey: m.smsSent(lock) ? "ask-verification-code" : "ask-phone-number",
    disallowClose: m.selectingLocation(lock),
    submitHandler: m.smsSent(lock) ? askVerificationCodeSubmitHandler : askPhoneNumberSubmitHandler
  }
}

// TODO: rename file to render.js
