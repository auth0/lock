import React from 'react';
import Card from './Card';
import Select from './Select';

export default ({ update, state }) => (
  <Card title="Select Lock's mode">
    <Select
      label="Mode"
      options={[
        { value: 'lock', text: 'Lock' },
        { value: 'lock+passwordless', text: 'Lock Passwordless' }
      ]}
      help="Choose which type of Lock you want to test"
      value={state.lockMode}
      onChange={e => update({ lockMode: e.target.value })}
    />
  </Card>
);
