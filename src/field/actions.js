import { Map } from 'immutable';
import { swap, updateEntity } from '../store/index';
import { cancelSelection, setField, setOptionField, startSelection } from './index';

export function changeField(id, name, value, validationFn, ...validationExtraArgs) {
  swap(updateEntity, 'lock', id, setField, name, value, validationFn, ...validationExtraArgs);
}

export function startOptionSelection(id, name, iconUrl, icon) {
  // TODO: should be transient
  swap(updateEntity, 'lock', id, m =>
    m
      .setIn(['field', 'selecting', 'name'], name)
      .setIn(['field', 'selecting', 'iconUrl'], iconUrl)
      .setIn(['field', 'selecting', 'icon'], icon)
  );
}

export function selectOption(id, name, option) {
  swap(updateEntity, 'lock', id, m =>
    setOptionField(m.deleteIn(['field', 'selecting']), name, option)
  );
}

export function cancelOptionSelection(id) {
  swap(updateEntity, 'lock', id, m => m.deleteIn(['field', 'selecting']));
}
