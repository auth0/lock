import React from 'react';
import List from '../ui/list';
import { cancelOptionSelection, selectOption } from './actions';
// TODO: these actions should be passed as props

export default ({ icon, iconUrl, model, name, items }) => (
  <List
    icon={icon}
    iconUrl={iconUrl}
    items={items}
    onSelect={x => selectOption(model.get('id'), name, x)}
    onCancel={() => cancelOptionSelection(model.get('id'))}
  />
);
