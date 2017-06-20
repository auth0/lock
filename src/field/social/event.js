import * as l from '../../core/index';
import { logIn } from '../../quick-auth/actions';

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
  return logIn(l.id(lock), provider);
}
