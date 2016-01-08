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

  onWillSlide() {
    this.sliding = true;
  }

  onDidSlide() {
    this.sliding = false;
    this.setState({reverse: false});
  }

  render() {
    const { auxiliaryPane, backHandler, contentRender, headerText, footerText, lock, screenName, showSubmitButton, tabs } = this.props;
    const { reverse, sliding } = this.state;

    const gravatar = l.gravatar(lock);
    const icon = l.ui.icon(lock);
    const globalError = l.globalError(lock);
    const globalSuccess = l.globalSuccess(lock);
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
    const submitButton = showSubmitButton
      && <SubmitButton
            color={primaryColor}
            disabled={disableSubmit}
            key="submit"
            ref="submit"
            tabIndex={l.tabIndex(lock, 10)}
         />;

    return (
      <div className="auth0-lock-cred-pane">
        <Header title={this.t(["title"], {__textOnly: true})} name={name} backHandler={backHandler && ::this.handleBack} backgroundUrl={backgroundUrl} backgroundColor={primaryColor} logoUrl={icon}/>
        <ReactTransitionGroup>
          {globalError && <GlobalMessage key="global-error" message={globalError} type="error" />}
          {globalSuccess && <GlobalMessage key="global-success" message={globalSuccess} type="success" />}
        </ReactTransitionGroup>
        <div style={{position: "relative"}}>
          <MultisizeSlide
            delay={550}
            onDidSlide={::this.onDidSlide}
            onWillSlide={::this.onWillSlide}
            transitionName="horizontal-fade"
            reverse={reverse}
          >
            <div key={(tabs && tabs.key) || screenName}>
              {tabsContainer}
              <div style={{position: "relative"}}>
                <MultisizeSlide
                  delay={550}
                  onDidSlide={::this.onDidSlide}
                  onWillSlide={::this.onWillSlide}
                  transitionName="horizontal-fade"
                  reverse={false}
                >
                  <div key={screenName}>
                  <div className="auth0-lock-content" key={screenName}>
                    <div className="auth0-lock-form">
                      {header}
                      {contentRender({focusSubmit: ::this.focusSubmit, lock})}
                    </div>
                  </div>
                  {footer}
                  </div>
                </MultisizeSlide>
              </div>
            </div>
          </MultisizeSlide>
        </div>
        <ReactCSSTransitionGroup
            transitionEnterTimeout={400}
            transitionLeaveTimeout={400}
            transitionName="vslide"
        >
          {submitButton}
        </ReactCSSTransitionGroup>
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
