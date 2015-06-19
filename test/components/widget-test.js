import React from 'react';
import { Map } from 'immutable';
import Widget from '../../src/components/widget';
import assert from 'assert';

describe('Widget', function(){

  var div;
  var comp;

  function render(lock) {
    comp = React.render(React.createElement(Widget, {lock: lock}), div);
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
