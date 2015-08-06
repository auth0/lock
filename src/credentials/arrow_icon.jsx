import React from 'react';

export default class PhoneNumberIcon extends React.Component {
  render() {
    const svgTag = '<svg width="5px" height="10px" viewBox="0 0 5 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" class="auth0-lock-icon-arrow"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" transform="translate(-396.000000, -3521.000000)" fill="#000000" opacity="0.539999962"><g id="SMS" transform="translate(153.000000, 3207.000000)"><g transform="translate(35.000000, 299.000000)"><g transform="translate(210.000000, 20.000000) rotate(-90.000000) translate(-210.000000, -20.000000) translate(198.000000, 8.000000)"><path id="Shape" d="M7,10 L12,15 L17,10 L7,10 Z"></path></g></g></g></g></g></svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} />;
  }
}
