import React from 'react';
import * as l from './index';

export default class MainScreenContainer extends React.Component {

  constructor(props, name, mainScreenRef) {
    super(props)
    this.name = name;
    this.mainScreenRef = mainScreenRef;
  }

  componentWillSlideIn(...args) {
    return this.mainScreen().componentWillSlideIn(...args);
  }

  componentDidSlideIn(...args) {
    return this.mainScreen().componentDidSlideIn(...args);
  }

  componentWillSlideOut(...args) {
    return this.mainScreen().componentWillSlideOut(...args);
  }

  mainScreen() {
    return this.refs[this.mainScreenRef];
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, [this.name].concat(keyPath), params);
  }

}
