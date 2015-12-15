import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MultisizeSlide from '../multisize-slide/multisize_slide';
import GlobalMessage from './global_message';
import SubmitButton from './submit_button';
import Header from '../header/header';
import * as l from './index';
import * as g from '../gravatar/index';
import Terms from '../lock/terms';


export default class Chrome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {reverse: false};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenName != nextProps.screenName) {
      this.sliding = true;
    }
  }

  didSlide() {
    this.sliding = false;
    this.setState({reverse: false});
  }

  render() {
    const { auxiliaryPane, backHandler, contentRender, headerText, footerText, lock, screenName, showSubmitButton, tabs } = this.props;
    const { reverse, sliding } = this.state;

    const gravatar = l.gravatar(lock);
    const icon = l.ui.icon(lock);
    const globalError = l.globalError(lock);
    const disableSubmit = l.submitting(lock);

    let backgroundUrl, name;
    if (gravatar) {
      backgroundUrl = g.imageUrl(gravatar);
      name = this.t(["welcome"], {name: g.displayName(gravatar), __textOnly: true});
    } else {
      backgroundUrl = icon;
      name = "";
    }
    const primaryColor = l.ui.primaryColor(lock);

    const header = headerText && <p>{headerText}</p>;
    const footer = footerText && <Terms>{footerText}</Terms>;
    const tabsContainer = tabs && <div className="auth0-lock-tabs-container">{tabs}</div>;

    return (
      <div className="auth0-lock-cred-pane">
        <Header title={this.t(["title"], {__textOnly: true})} name={name} backHandler={backHandler && ::this.handleBack} backgroundUrl={backgroundUrl} backgroundColor={primaryColor} logoUrl={icon}/>
        <ReactTransitionGroup>
          {globalError && <GlobalMessage key="global-error" message={globalError} type="error" />}
        </ReactTransitionGroup>
        <div style={{position: "relative"}}>
          <MultisizeSlide delay={525} transitionName="horizontal-fade" reverse={reverse}>
            <Placeholder ref="content" key={(tabs && tabs.key) || screenName} slideEnd={::this.didSlide}>
              {tabsContainer}
              <div style={{position: "relative"}}>
                <MultisizeSlide delay={525} transitionName="horizontal-fade" reverse={false}>
                  <Placeholder ref="content" key={screenName} slideEnd={::this.didSlide}>
                    <div className="auth0-lock-content">
                      <div className="auth0-lock-form">
                        {header}
                        {contentRender({focusSubmit: ::this.focusSubmit, lock})}
                      </div>
                    </div>
                    {footer}
                  </Placeholder>
                </MultisizeSlide>
              </div>
            </Placeholder>
          </MultisizeSlide>
        </div>
        {showSubmitButton && <SubmitButton ref="submit" color={primaryColor} disabled={disableSubmit} tabIndex={l.tabIndex(lock, 10)} />}
        <ReactCSSTransitionGroup transitionName="slide" transitionEnterTimeout={350} transitionLeaveTimeout={350}>
          {auxiliaryPane}
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  focusSubmit() {
    this.refs.submit.focus();
  }

  handleBack() {
    if (this.sliding) return;

    const { backHandler, lock } = this.props;
    this.setState({reverse: true});
    backHandler(l.id(lock));
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, keyPath, params);
  }
}

Chrome.propTypes = {
  auxiliaryPane: React.PropTypes.element,
  backHandler: React.PropTypes.func,
  contentRender: React.PropTypes.func.isRequired,
  footerText: React.PropTypes.element,
  headerText: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  showSubmitButton: React.PropTypes.bool.isRequired
};

Chrome.defaultProps = {
  showSubmitButton: true
};

class Placeholder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {height: ""};
  }

  componentWillSlideIn(slide) {
    const node = ReactDOM.findDOMNode(this);
    this.originalHeight = parseInt(window.getComputedStyle(node, null).height, 10);
    this.setState({height: slide.height});
    setTimeout(() => this.setState({height1: this.originalHeight}), 17);
  }

  componentDidSlideIn() {
    this.props.slideEnd();
  }

  componentWillSlideOut(callback) {
    const node = ReactDOM.findDOMNode(this);
    const size = window.getComputedStyle(node, null).height;
    callback({height: parseInt(size, 10), reverse: this.reverse});
  }

  componentDidUpdate() {
    if (this.state.height1 && this.state.height) {
      const current = parseInt(this.state.height, 10);
      const last = parseInt(this.state.height1, 10);

      if (current < last) {
        setTimeout(() => this.setState({height: current + Math.min(3, last - current)}), 3);
      } else if (current > last) {
        setTimeout(() => this.setState({height: current - Math.min(3, current - last)}), 3);
      } else {
        this.setState({height: ""});
      }
    }
  }

  render() {
    const { children } = this.props;
    const { height } = this.state;

    return <div style={height ? {height: height} : {}}>{children}</div>;
  }

}
