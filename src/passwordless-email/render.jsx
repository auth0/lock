import React from 'react';
import Lock from '../lock/lock';
import AskEmail from './ask_email';
import AskCode from './ask_code';
import Done from './done';
import { LockStates } from '../control/constants';
import { requestPasswordlessEmail, signIn } from './actions';

export default function render(lock) {
  const state = lock.get("state");
  switch(state) {
  case LockStates.ASK_CODE:
    return (
      <Lock lock={lock} showHeader={true} submitHandler={askCodeSubmitHandler}>
        <AskCode />
      </Lock>
    );
  case LockStates.DONE:
    return <Lock lock={lock} showHeader={false}><Done /></Lock>;
  case LockStates.READY:
    return (
      <Lock lock={lock} showHeader={true} submitHandler={askEmailSubmitHandler}>
        <AskEmail />
      </Lock>
    );
  default:
    const mode = lock.get("mode");
    throw new Error(`unknown state ${state} for mode ${mode}`)
  }
}

function askEmailSubmitHandler(lock) {
  requestPasswordlessEmail(lock.get("id"));
}

function askCodeSubmitHandler(lock) {
  signIn(lock.get("id"));
}
