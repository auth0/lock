import React from 'react';
import BackButton from '../header/back_button';

class CheckmarkIcon extends React.Component {
  render() {
    const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" class="checkmark"> <circle cx="26" cy="26" r="25" fill="none" class="checkmark__circle"></circle> <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="checkmark__check"></path> </svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} />;
  }
}

export default class ConfirmationPane extends React.Component {
  render() {
    const { backHandler } = this.props;

    return (
      <div className="auth0-lock-confirmation">
        <BackButton onClick={backHandler} />
        <CheckmarkIcon />
        {this.props.children}
      </div>
    );
  }
}
