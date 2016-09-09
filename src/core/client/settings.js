import { load } from '../../utils/cdn_utils';

export function fetchClientSettings(clientID, clientBaseUrl, cb) {
  load({
    method: "setClient",
    url: `${clientBaseUrl}/client/${clientID}.js?t${+new Date()}`,
    check: o => o && o.id === clientID,
    cb: cb
  });
}
