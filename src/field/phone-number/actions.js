import { getEntity, read, swap, updateEntity } from '../../store/index';
import * as c from '../index';
import * as cc from '../country_codes';
import { validatePhoneNumber } from '../../utils/validation_utils';
import {
  closeLocationSelect,
  openLocationSelect
} from './index';

export function changePhoneNumber(id, str) {
  swap(updateEntity, "lock", id, c.setField, "phoneNumber", str, validatePhoneNumber);
}

export function changePhoneLocation(id, location) {
  swap(updateEntity, "lock", id, lock => {
    lock = closeLocationSelect(lock);
    lock = c.setPhoneLocation(lock, location);
    return lock;
  });
}

// TODO: move this to another place since is not really an action.
export function setInitialPhoneLocation(m, options) {
  const { defaultLocation } = options;

  if (defaultLocation && typeof defaultLocation === "string") {
    const location = cc.findByIsoCode(defaultLocation);
    if (!location) {
      throw new Error(`Unable to set the default location, can't find any country with the code "${defaultLocation}".`);
    }
    return c.setPhoneLocation(m, location);
  } else {
    const location = read(getEntity, "location");
    const isoCode = cc.findByIsoCode(location && location.get("isoCode"));
    return isoCode ? c.setPhoneLocation(m, isoCode) : m;
  }
}

export function selectPhoneLocation(id, searchStr) {
  swap(updateEntity, "lock", id, openLocationSelect, searchStr);
}

export function cancelSelectPhoneLocation(id) {
  swap(updateEntity, "lock", id, closeLocationSelect);
}
