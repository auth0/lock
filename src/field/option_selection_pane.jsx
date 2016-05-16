import React from 'react';
import List from '../ui/list';
import { cancelOptionSelection, selectOption } from './actions';
// TODO: these actions should be passed as props

export default ({iconUrl, model, name, items}) => (
  <List
    iconUrl={iconUrl}
    items={items}
    autofocus={true}
    onSelect={x => selectOption(model.get("id"), name, x)}
    onCancel={() => cancelOptionSelection(model.get("id"))}
  />

);
