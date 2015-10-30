import Magiclink from '../../passwordless/magiclink';

export default function render(lock) {
  return new Magiclink(lock);
}
