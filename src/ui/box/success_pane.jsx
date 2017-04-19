import React from 'react';
import ConfirmationPane from './confirmation_pane';

const svg =
  '<svg focusable="false" width="56px" height="56px" viewBox="0 0 52 52" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="checkmark"> <circle cx="26" cy="26" r="25" fill="none" class="checkmark__circle"></circle> <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="checkmark__check"></path> </svg>';

const SuccessPane = props => <ConfirmationPane svg={svg} {...props} />;

export default SuccessPane;
