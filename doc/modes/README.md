# Modes

Every authentication flow in Lock (such as _magiclink_, _sms_, _social_ and so on) is implemented as a _plugin_ and we call them **modes**.

- Getting Started: Creating your First Mode
- Actions, State Management and Rendering Model
- Managing Options
- Dicts
- Mode Classes
- Screen Classes

## Getting Started: Creating your First Mode

To create a new mode you need to extend the `Mode` class and implement (at least) the `constructor` and the `render` methods.

```js
// getting-started/custom_mode.js
import Mode from 'auth0-lock-passwordless/src/lock/mode';
import CustomScreen from './custom_screen';

export default class CustomMode extends Mode {

  constructor() {
    // "custom" is the name of the mode, after registering the plugin a `custom`
    // method will be available in lock instances.
    super("custom");
  }

  render(model) {
    // Returns a `Screen` instance that will be rendered. In this simple
    // example the same screen is returned all the time, but in the real world
    // you'll choose what screen to render by inspecting the `model` value.
    return new CustomScreen();
  }

}
```

The `CustomScreen` instance returned in the `render` method extends the `Screen` class.

```js
// getting-started/custom_screen.js
import React from 'react';
import Screen from 'auth0-lock-passwordless/src/lock/screen';

export default class CustomScreen extends Screen {

  constructor() {
    // "customScreen" is the name of the screen, it is used internally to keep
    // track of when a screen changes to perform an animation.
    super("customScreen");
  }

  render({model}) {
    // It takes a prop object and returns a React element. Here we are rendering
    // always the same div but you'll probably use the lock value to return
    // something more interesting.
    return <div>CustomScreen</div>;
  }

}
```

Finally, once you let `Lock` know about your new `CustomMode` you can activate
it by calling `custom` (the mode's name) in a `Lock` instance.

```js
// getting-started/index.js
import Auth0LockPasswordless from 'auth0-lock-passwordless';
import CustomMode from './custom_mode';


// register plugin
Auth0LockPasswordless.plugins.register(CustomMode);

const lock = new Auth0LockPasswordless("cid", "tenant.auth0.com");

// invoke method added by plugin
lock.custom();
```
