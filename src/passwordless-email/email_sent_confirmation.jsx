import React from 'react';

class BackIcon extends React.Component {
  render() {
    const svgTag = '<svg enable-background="new 0 0 24 24" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="auth0-lock-go-back"> <polyline fill="none" points="12.5,21 3.5,12 12.5,3 " stroke="#000000" stroke-miterlimit="10" stroke-width="2"></polyline> <line fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="2" x1="22" x2="3.5" y1="12" y2="12"></line> </svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} />;
  }
}

class CheckmarkIcon extends React.Component {
  render() {
    const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" class="checkmark"> <circle cx="26" cy="26" r="25" fill="none" class="checkmark__circle"></circle> <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="checkmark__check"></path> </svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} />;
  }
}

class RetryIcon extends React.Component {
  render() {
    const svgTag = '<svg height="32px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M27.877,19.662c0.385-1.23,0.607-2.531,0.607-3.884c0-7.222-5.83-13.101-13.029-13.194v4.238    c4.863,0.093,8.793,4.071,8.793,8.956c0,0.678-0.088,1.332-0.232,1.966l-3.963-1.966l2.76,8.199l8.197-2.762L27.877,19.662z"></path> <path d="M7.752,16.222c0-0.678,0.088-1.332,0.232-1.967l3.963,1.967l-2.76-8.199L0.99,10.785l3.133,1.553    c-0.384,1.23-0.607,2.531-0.607,3.885c0,7.223,5.83,13.1,13.03,13.194v-4.238C11.682,25.086,7.752,21.107,7.752,16.222z"></path> </svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} />;
  }
}

export default class EmailSentConfirmation extends React.Component {
  render() {
    return (
      <div className="auth0-lock-confirmation">
        {/* TODO: go back functionality */}
        <BackIcon />
        <CheckmarkIcon />
        <p>We sent you a link to sign in.<br />Please check your inbox.</p>
        {/* TODO: resend functionality */}
        <a className="auth0-lock-resend-link" href="">
          Resend Again <RetryIcon />
        </a>
        {/* <span className="auth0-lock-sent-label">Sent!</span> */}
      </div>
    )
  }
}
