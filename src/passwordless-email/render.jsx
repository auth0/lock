import React from 'react';
import Lock from '../lock/lock';
import AskEmail from './ask_email';
import AskVerificationCode from './ask_verification_code';
import Done from './done';
import { LockStates } from '../control/constants';
import { requestPasswordlessEmail, signIn } from './actions';
import * as m from './index';

export default function render(lock) {
  const spec = {
    confirmation: m.emailSent(lock) && Done,
    content: AskEmail,
    submitHandler: !m.emailSent(lock) && askEmailSubmitHandler
  };

  return (
    <Lock lock={lock} submitHandler={spec.submitHandler}>
      <spec.content />
    </Lock>
  );
  // switch(state) {
  // case LockStates.ASK_VERIFICATION_CODE:
  //   return (
  //     <Lock lock={lock} showHeader={true} submitHandler={askVerificationCodeSubmitHandler}>
  //       <AskVerificationCode />
  //     </Lock>
  //   );
  // case LockStates.DONE:
  //   return <Lock lock={lock} showHeader={false}><Done /></Lock>;
  // case LockStates.READY:
  //   return (
  //     <Lock lock={lock} showHeader={true} submitHandler={askEmailSubmitHandler}>
  //       <AskEmail />
  //     </Lock>
  //   );
  // default:
  //   const mode = lock.get("mode");
  //   throw new Error(`unknown state ${state} for mode ${mode}`)
  // }
}

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(lock.get("id"));
}

function askVerificationCodeSubmitHandler(lock) {
  signIn(lock.get("id"));
}
