import { load } from '../../utils/cdn_utils';

export function fetchClientSettings(clientID, assetsUrl, cb) {
  load({
    method: "setClient",
    url: `${assetsUrl}/client/${clientID}.js?t${+new Date()}`,
    check: o => o && o.id === clientID,
    cb: cb
  });
}
