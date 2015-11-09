import { getEntity, read, swap, updateEntity } from '../../store/index';
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

// TODO: move this to another place since is not really an action.
export function setInitialPhoneLocation(m, options) {
  const { defaultLocation } = options;

  if (defaultLocation && typeof defaultLocation === "string") {
    if (!cc.findByIsoCode(defaultLocation)) {
      throw new Error(`Unable to set the default location, can't find any country with the code "${defaultLocation}".`);
    }
    return c.setPhoneLocation(m, defaultLocation);
  } else {
    const user = read(getEntity, "user");
    const userLocation = user && user.get("location");
    return cc.findByIsoCode(userLocation)
      ? c.setPhoneLocation(m, userLocation)
      : m;
  }
}

export function selectPhoneLocation(id, searchStr) {
  swap(updateEntity, "lock", id, openLocationSelect, searchStr);
}

export function cancelSelectPhoneLocation(id) {
  swap(updateEntity, "lock", id, closeLocationSelect);
}
