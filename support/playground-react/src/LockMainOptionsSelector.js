import React from 'react';
import Card from './Card';
import Input from './Input';

export default ({ update, state }) => (
  <Card title="Fill in your settings">
    <Input
      onChange={e => update({ clientId: e.target.value })}
      value={state.clientId}
      label="Client ID"
      help="Your Auth0 client ID"
    />
    <Input
      onChange={e => update({ domain: e.target.value })}
      value={state.domain}
      label="Domain"
      help="Your Auth0 domain"
    />
  </Card>
);
