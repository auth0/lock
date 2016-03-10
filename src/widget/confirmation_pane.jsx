import React from 'react';
import { BackButton, CloseButton } from './button';

const svg = '<svg width="56px" height="56px" viewBox="0 0 52 52" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="checkmark"> <circle cx="26" cy="26" r="25" fill="none" class="checkmark__circle"></circle> <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="checkmark__check"></path> </svg>';

export default class ConfirmationPane extends React.Component {

  render() {
    const { backHandler, closeHandler } = this.props;

    return (
      <div className="auth0-lock-confirmation">
        {closeHandler && <CloseButton onClick={closeHandler}/>}
        {backHandler && <BackButton onClick={backHandler} />}
        <div className="auth0-lock-confirmation-content">
          <span dangerouslySetInnerHTML={{__html: svg}} />
          {this.props.children}
        </div>
      </div>
    );
  }

}
