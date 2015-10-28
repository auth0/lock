import { Mode } from '../index';
import render from './render';

export default class Social extends Mode {

  constructor() {
    super("social");
  }

  processOpenOptions(options) {
    const { connections } = options;
    if (!Array.isArray(connections) || connections.length === 0) {
      throw new Error("The `connections` option array needs to be provided with at least one connection.");
    }

    return options;
  }

  render(lock) {
    return render(lock);
  }

}
