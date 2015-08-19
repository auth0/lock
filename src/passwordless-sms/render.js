import askPhoneNumber from './ask_phone_number';
import askVcode from './ask_vcode';
import { close, reset, sendSMS, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';

function askPhoneNumberSubmitHandler(lock) {
  sendSMS(l.id(lock));
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(lock) {
  reset(l.id(lock), false);
}

export default function render(lock) {
  return {
    backHandler: m.smsSent(lock) ? backHandler : undefined,
    closeHandler: close,
    mainPane: m.smsSent(lock) ? askVcode : askPhoneNumber,
    mainPaneKey: m.smsSent(lock) ? "ask-vcode" : "ask-phone-number",
    disallowClose: m.selectingLocation(lock),
    submitHandler: m.smsSent(lock) ? askVcodeSubmitHandler : askPhoneNumberSubmitHandler
  }
}
