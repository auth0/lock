import Mode from '../../lock/mode';
import MagiclinkScreen from '../magiclink';

export default class MagiclinkMode extends Mode {

  constructor() {
    super("magiclink");
  }

  render(lock) {
    return new MagiclinkScreen();
  }

}
