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

export function setInitialPhoneLocation(id, options) {
  const setPhoneLocation = (isoCode) => {
    const location = cc.findByIsoCode(isoCode);
    if (!location) {
      return false;
    }

    swap(updateEntity, "lock", id, c.setPhoneLocation, location);
    return true;
  };

  const { defaultLocation } = options;

  if (defaultLocation && typeof defaultLocation === "string") {
    if (!setPhoneLocation(defaultLocation)) {
      throw new Error(`Unable to set the default location, can't find any country with the code "${defaultLocation}".`);
    }
  } else {
    const user = read(getEntity, "user");
    setPhoneLocation(user && user.get("location"));
  }
}

export function selectPhoneLocation(id, searchStr) {
  swap(updateEntity, "lock", id, openLocationSelect, searchStr);
}

export function cancelSelectPhoneLocation(id) {
  swap(updateEntity, "lock", id, closeLocationSelect);
}
