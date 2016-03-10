import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MultisizeSlide from './multisize_slide';
import GlobalMessage from './global_message';
import SubmitButton from './submit_button';
import Header from './header';
import * as l from '../lock/index';
import * as g from '../gravatar/index';

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
    const {
      auxiliaryPane,
      backHandler,
      contentRender,
      headerText,
      footerText,
      globalError,
      globalSuccess,
      gravatar,
      icon,
      isSubmitting,
      lock,
      primaryColor,
      screenName,
      showSubmitButton,
      tabs,
      transitionName
    } = this.props;

    const { reverse, sliding } = this.state;

    let backgroundUrl, name;
    if (gravatar) {
      backgroundUrl = g.imageUrl(gravatar);
      name = this.t(["welcome"], {name: g.displayName(gravatar), __textOnly: true});
    } else {
      backgroundUrl = icon;
      name = "";
    }

    const header = headerText && <p>{headerText}</p>;
    const footer = footerText
      && <small className="auth0-lock-terms">{footerText}</small>;
    const tabsContainer = tabs && <div className="auth0-lock-tabs-container">{tabs}</div>;
    const submitButton = showSubmitButton
      && <SubmitButton
            color={primaryColor}
            disabled={isSubmitting}
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
            transitionName={transitionName}
            reverse={reverse}
          >
            <div key={(tabs && tabs.key) || screenName}>
              {tabsContainer}
              <div style={{position: "relative"}}>
                <MultisizeSlide
                  delay={550}
                  onDidSlide={::this.onDidSlide}
                  onWillSlide={::this.onWillSlide}
                  transitionName={transitionName}
                  reverse={false}
                >
                  <div key={screenName} className="auth0-lock-body-content">
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
  globalError: React.PropTypes.string,
  globalSuccess: React.PropTypes.string,
  gravatar: React.PropTypes.object,
  headerText: React.PropTypes.element,
  icon: React.PropTypes.string.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  lock: React.PropTypes.object.isRequired,
  primaryColor: React.PropTypes.string.isRequired,
  showSubmitButton: React.PropTypes.bool.isRequired,
  transitionName: React.PropTypes.string.isRequired
};

Chrome.defaultProps = {
  showSubmitButton: true
};
