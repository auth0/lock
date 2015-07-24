import React from 'react';
import { Map } from 'immutable';
import Lock from '../../src/lock/lock';
import assert from 'assert';

describe('Lock', function(){

  var div;
  var comp;

  function render(lock) {
    comp = React.render(React.createElement(Lock, {lock: lock}, React.createElement('div')), div);
  }

  beforeEach(function () {
    div = document.createElement("div");
  });

  afterEach(function () {
    if (div) {
      React.unmountComponentAtNode(div);
      comp = null;
    }
  });

  it('renders a form', function(){
    render(Map({}));

    assert(div.querySelector('form'));
  });
});
