import Mode from 'auth0-lock-passwordless/src/lock/mode';
import CustomScreen from './custom_screen';

export default class CustomMode extends Mode {

  constructor() {
    // "custom" is the name of the mode, after registering the plugin a `custom`
    // method will be available in lock instances.
    super("custom");
  }

  render(lock) {
    // This method returns a `Screen` that will be rendered. In this simple
    // example the same screen is returned all the time, but in the real world
    // you'll choose what screen to render by inspecting the `lock` value.
    return new CustomScreen();
  }

}
