import { getEntity, read, swap, updateEntity } from '../../store/index';
import webAPI from '../web_api';

export function fetchLocation(id) {
  const location = read(getEntity, "location", 0);

  if (!location || !location.get("syncStatus")) {
    webAPI.getUserCountry(id, (error, isoCode) => {
      swap(updateEntity, "location", 0, m => {
        return error
          ? m.set("syncStatus", "error")
          : m.set("syncStatus", "ok").set("isoCode", isoCode);
      });
    });
  }
}
