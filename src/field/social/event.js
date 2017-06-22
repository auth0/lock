import * as l from '../../core/index';

export function emitFederatedLoginEvent(lock, provider, isSignUp) {
  let prov;

  try {
    prov = provider.toJS();
  } catch (e) {
    prov = provider;
  }

  l.emitEvent(lock, 'federated login', {
    name: prov.name,
    strategy: prov.strategy,
    action: isSignUp ? 'signup' : 'signin'
  });
}
