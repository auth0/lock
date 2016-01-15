import webAPI from '../web_api';
import { swap, updateEntity } from '../../store/index';
import { skipSSOLogin as skip } from './index';

export function skipSSOLogin(id) {
  swap(updateEntity, "lock", id, skip, true);
}

export function signIn(id, connection) {
  // TODO: consider popup
  webAPI.signIn(
    id,
    {connection: connection.name},
    (error, ...args) => {
      if (error) {
        setTimeout(() => signInError(id, error), 250);
      } else {
        signInSuccess(id, ...args);
      }
    }
  );
}

function signInSuccess() {
  // TODO: consider popup
}

function signInError() {
  // TODO: consider popup
}
