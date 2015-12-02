import { Mode } from '../index';
import MagiclinkScreen from '../../passwordless/magiclink';

export default class Magiclink extends Mode {

  constructor() {
    super("magiclink");
  }

  render(lock) {
    return new MagiclinkScreen();
  }

}
