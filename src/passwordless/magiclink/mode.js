import Mode from '../../lock/mode';
import MagiclinkScreen from '../magiclink';
import dict from './dict';

export default class MagiclinkMode extends Mode {

  constructor() {
    super("magiclink", dict);
  }

  render(lock) {
    return new MagiclinkScreen();
  }

}
