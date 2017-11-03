import webAPI from '../web_api';
import Cache from '../../utils/cache';

const cache = new Cache((...args) => webAPI.getSSOData(...args));

export function fetchSSOData(id, cb) {
  cache.get(id, cb);
}
