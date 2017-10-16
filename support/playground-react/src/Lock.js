import React from 'react';
import Card from './Card';

export default class LockPreview extends React.Component {
  lock;
  componentDidMount() {
    const {
      lockMode,
      domain,
      clientId,
      authParams,
      allowedConnections,
      passwordlessMethod,
      avatar,
      languageDictionary,
      labeledSubmitButton,
      language,
      logo,
      primaryColor,
      allowShowPassword
    } = this.props.state;

    const lockOptions = {
      oidcConformant: true,
      container: 'lock-container',
      auth: {
        params: authParams
      },
      allowedConnections,
      passwordlessMethod,
      languageDictionary,
      allowShowPassword,
      language,
      avatar,
      theme: {
        labeledSubmitButton,
        primaryColor,
        logo
      },
      prefill: {
        username: 'johnfoo@gmail.com'
      }
    };
    if (lockMode === 'lock') {
      this.lock = new window.Auth0Lock(clientId, domain, lockOptions);
    } else {
      this.lock = new window.Auth0LockPasswordless(clientId, domain, lockOptions);
    }
    this.subscribeToEvents();
    this.lock.show();
  }
  subscribeToEvents = () => {
    const { update, state } = this.props;
    var validEvents = [
      'show',
      'hide',
      'unrecoverable_error',
      'authenticated',
      'authorization_error',
      'hash_parsed',
      'signin ready',
      'signup ready',
      'forgot_password ready',
      'forgot_password submit',
      'signin submit',
      'signup submit',
      'federated login'
    ];
    validEvents.forEach(e => {
      this.lock.on(e, (...args) => {
        let finalArgs = args;
        if (args.length === 0) {
          finalArgs = undefined;
        }
        update(prevState => ({
          logs: [...prevState.logs, { event: e, arguments: finalArgs }]
        }));
      });
    });
  };
  render() {
    return (
      <Card title="Lock Preview">
        <div id="lock-container" />
      </Card>
    );
  }
}
