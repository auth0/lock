import webAPI from '../web_api';
import Cache from '../../remote-data/cache';

const cache = new Cache((...args) => webAPI.getSSOData(...args));

export function fetchSSOData(id, withAD, cb) {
  cache.get(id, withAD, cb);
}
