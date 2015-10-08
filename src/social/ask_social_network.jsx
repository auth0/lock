import React from 'react';
import CredPane from '../lock/cred_pane';
import SocialButton from './social_button';
import * as l from '../lock/index';

export default class AskSocialNetwork extends React.Component {
  render() {
    const { lock } = this.props;
    const buttons = l.ui.connections(lock).map(x => {
      return <SocialButton key={x} name={x} lockID={l.id(lock)} />;
    });

    return (
      <CredPane lock={lock} showSubmitButton={false} ref="cred">
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
}

AskSocialNetwork.contextTypes = {
  lock: React.PropTypes.object
}
