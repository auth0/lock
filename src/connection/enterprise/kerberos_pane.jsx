import React from 'react';
import { skipSSOLogin } from '../../lock/sso/actions';
import * as l from '../../lock/index';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';

export default class KerberosPane extends React.Component {

  handleClick(e) {
    e.preventDefault();
    // TODO: instead of calling skipSSOLogin we should have something
    // generic for this quick logins.
    skipSSOLogin(l.id(this.props.lock));
  }

  render() {
    const { header, lock, skipLastLoginLabel } = this.props;

    // TODO: implement click handler.
    // TODO: provide translation for button label.

    return (
      <QuickAuthPane
        alternativeLabel={skipLastLoginLabel}
        alternativeClickHandler={::this.handleClick}
        buttonLabel="Windows Authentication"
        buttonClickHandler={e => alert("not implemented")}
        header={header}
        strategy="windows"
      />
    );
  }

}

KerberosPane.propTypes = {
  header: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  skipLastLoginLabel: React.PropTypes.string.isRequired
};
