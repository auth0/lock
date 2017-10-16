import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

global.Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true
});

ReactDOM.render(<App />, document.getElementById('root'));
