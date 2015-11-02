import { swap, updateEntity } from '../../store/index';
import * as c from '../index';
import * as cc from '../country_codes';
import {
  closeLocationSelect,
  openLocationSelect
} from './index';

export function changePhoneNumber(id, phoneNumber) {
  swap(updateEntity, "lock", id, c.setPhoneNumber, phoneNumber);
}

export function changePhoneLocation(id, location) {
  swap(updateEntity, "lock", id, lock => {
    lock = closeLocationSelect(lock);
    lock = c.setPhoneLocation(lock, location);
    return lock;
  });
}

export function setDefaultLocation(id, str) {
  const result = cc.findByIsoCode(str);
  if (!result) {
    throw new Error(`Unable to set the default location, can't find any country with the code "${str}".`);
  }

  swap(updateEntity, "lock", id, c.setPhoneLocation, result);
}

export function selectPhoneLocation(id, searchStr) {
  swap(updateEntity, "lock", id, openLocationSelect, searchStr);
}

export function cancelSelectPhoneLocation(id) {
  swap(updateEntity, "lock", id, closeLocationSelect);
}
