import React from 'react';
import Screen from 'auth0-lock-passwordless/src/lock/screen';

export default class CustomScreen extends Screen {

  constructor() {
    // "customScreen" is the name of the screen, it is used internally to keep
    // track of when a screen changes to perform an animation.
    super("customScreen");
  }

  render({lock}) {
    // It takes a prop object and returns a React element. Here we are rendering
    // always the same div but you'll probably use the lock value to return
    // something more interesting.
    return <div>CustomScreen</div>;
  }

}
