import Auth0 from 'auth0-js';
import Cache from '../../utils/cache';

const cache = new Cache((...args) => addClientScriptTag(...args));

export function fetchClientSettings(clientID, assetsUrl, cb = () => {}) {
  cache.get(clientID, assetsUrl, cb);
}

const cbs = {};

function addClientScriptTag(clientID, assetsUrl, cb) {
  cbs[clientID] = cb;
  const script = global.document.createElement('script');
  script.src = `${assetsUrl}/client/${clientID}.js?t${+new Date()}`;
  global.document.getElementsByTagName('head')[0].appendChild(script);

  const handleError = () => cb({});

  const timeoutID = setTimeout(handleError, 5000);

  script.addEventListener('load', () => clearTimeout(timeoutID));

  script.addEventListener('error', () => {
    clearTimeout(timeoutID);
    handleError();
  });

}

global.window.Auth0 = Auth0;

global.window.Auth0.setClient = function(settings) {
  cbs[settings.id](null, settings);
  delete cbs[settings.id];
};
