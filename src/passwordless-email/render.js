import AskEmail from './ask_email';
import AskVcode from './ask_vcode';
import { close, reset, requestPasswordlessEmail, signIn } from './actions';
import * as l from '../lock/index';
import * as m from './index';


function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(l.id(lock));
}

function askVcodeSubmitHandler(lock) {
  signIn(l.id(lock));
}

function backHandler(lock) {
  reset(l.id(lock), false);
}

export default function render(lock) {
  if (m.isSendLink(lock)) {
    return {
      closeHandler: close,
      mainPane: AskEmail,
      mainPaneKey: "ask-email",
      submitHandler: !m.emailSent(lock) && askEmailSubmitHandler
    };
  } else {
    return {
      backHandler: m.emailSent(lock) ? backHandler : null,
      closeHandler: close,
      mainPane: m.emailSent(lock) ? AskVcode : AskEmail,
      mainPaneKey: m.emailSent(lock) ? "ask-vcode" : "ask-email",
      submitHandler: m.emailSent(lock) ? askVcodeSubmitHandler : askEmailSubmitHandler
    };
  }
}
