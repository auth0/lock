import React from 'react';
import MainScreen from './main_screen';
import * as l from './index';

export default class MainScreenContainer extends React.Component {

  constructor(props, name) {
    super(props)
    this.name = name;
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
    return this.refs.main;
  }

  backHandler() {

  }

  renderAuxiliaryPane() {
    return null;
  }

  renderContent() {

  }

  renderFooterText() {
    return this.t(["footerText"]);
  }

  renderHeaderText() {
    return this.t(["headerText"]);
  }

  showSubmitButton() {

  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, [this.name].concat(keyPath), params);
  }

  render() {
    return (
      <MainScreen
        auxiliaryPane={this.renderAuxiliaryPane()}
        backHandler={::this.backHandler()}
        footerText={this.renderFooterText()}
        headerText={this.renderHeaderText()}
        lock={this.props.lock}
        ref="main"
        showSubmitButton={this.showSubmitButton()}
      >
        {this.renderContent()}
      </MainScreen>
    );
  }

}
