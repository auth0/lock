import React from 'react';
import CredPane from '../lock/cred_pane';
import ConfirmationPane from '../lock/confirmation_pane';
import SocialButton from './social_button';
import { close } from './actions';
import * as l from '../lock/index';
// TODO
import * as mp from '../passwordless/index';

export default class AskSocialNetwork extends React.Component {
  render() {
    const { lock } = this.props;
    const buttons = l.ui.connections(lock).map(x => {
      return <SocialButton key={x} name={x} lockID={l.id(lock)} />;
    });

    const auxiliaryPane = mp.signedIn(lock) ?
      <SignedInConfirmation key="auxiliarypane" lock={lock} /> : null;

    const terms = this.t(["footerText"]);

    return (
      <CredPane lock={lock} showSubmitButton={false} ref="cred" auxiliaryPane={auxiliaryPane}>
        <div className="auth0-lock-passwordless auth0-lock-mode">
          <div className="auth0-lock-form auth0-lock-passwordless">
            {buttons}
          </div>
        </div>
      </CredPane>
    );
  }

  componentWillSlideIn(...args) {
    return this.refs.cred.componentWillSlideIn(...args);
  }

  componentDidSlideIn(...args) {
    return this.refs.cred.componentDidSlideIn(...args);
  }

  componentWillSlideOut(...args) {
    return this.refs.cred.componentWillSlideOut(...args);
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["network"].concat(keyPath), params);
  }
}

AskSocialNetwork.contextTypes = {
  lock: React.PropTypes.object
}

// Copied from ask vcode
class SignedInConfirmation extends React.Component {
  render() {
    const { lock } = this.props;
    const closeHandler = l.ui.closable(lock) ? ::this.handleClose : undefined;

    return (
      <ConfirmationPane closeHandler={closeHandler}>
        <p>{this.t(["success"])}</p>
      </ConfirmationPane>
    )
  }

  handleClose() {
    close(l.id(this.props.lock));
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["confirmation"].concat(keyPath), params);
  }
}
