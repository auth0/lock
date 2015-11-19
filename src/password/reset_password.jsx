import React from 'react';
import Screen from '../lock/screen';

export default class ResetPassword extends Screen {

  constructor() {
    super("resetPassword");
  }

  submitHandler(lock) {
    return function() { };
  }

  render({lock}) {
    return <div>Reset password</div>;
  }

}
