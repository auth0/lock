import { LockStates } from '../control/constants';
import { updateLock } from '../store/index';
import { setCountryCode } from '../forms/index';

export function selectCountryCode(lockID) {
  updateLock(lockID, lock => lock.set("state", LockStates.SELECT_COUNTRY_CODE));
}

export function changeCountryCode(lockID, countryCode) {
  updateLock(lockID, setCountryCode, countryCode);
  updateLock(lockID, lock => lock.set("state", LockStates.READY));
}
