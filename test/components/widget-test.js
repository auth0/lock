import React from 'react';
import Widget from '../../src/components/widget';
import assert from 'assert';

describe('Widget', function(){

  var div;
  var comp;

  function render() {
    comp = React.render(React.createElement(Widget), div);
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

  it('renders a h1 that says "Hello world!"', function(){
    render();

    assert(div.querySelector('h1'));
    assert.equal(div.querySelector('h1').textContent, 'Hello world!')
  });
});
