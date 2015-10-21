import React from 'react';
import EmailPane from './email_pane';

export default class AskEmail extends React.Component {

  render() {
    const { lock, placeholder } = this.props;

    return <EmailPane lock={lock} placeholder={placeholder} tabIndex={1} />;
  }

}
