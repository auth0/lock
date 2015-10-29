import React from 'react';
import AskSocialNetworkOrEmail from '../../cred/or/ask_social_network_or_email';
import * as l from '../../lock/index';
import * as m from '../../passwordless/index';

export default function render(lock) {
  return new AskSocialNetworkOrEmail(
    lock,
    m.passwordlessStarted(lock) || l.signedIn(lock)
  );
}
