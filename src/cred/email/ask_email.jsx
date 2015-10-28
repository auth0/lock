import React from 'react';
import EmailPane from './email_pane';
import * as l from '../../lock/index';

const NAME = "email";

export default class AskEmail extends React.Component {

  render() {
    const { lock } = this.props;
    const placeholder =
      l.ui.t(lock, [NAME, "emailInputPlaceholder"], {__textOnly: true});

    return <EmailPane lock={lock} placeholder={placeholder} tabIndex={1} />;
   }

}
