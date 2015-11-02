import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GlobalError from './global_error';
import SubmitButton from './submit_button';
import Header from '../header/header';
import * as l from './index';
import * as g from '../gravatar/index';
import Terms from '../lock/terms';


export default class Chrome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {height: "", show: true};
  }

  componentDidMount() {
    this.reverse = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!l.globalError(this.props.lock) && l.globalError(nextProps.lock)) {
      this.setState({height: "auto"});
    }
  }

  render() {
    const { auxiliaryPane, backHandler, contentRender, headerText, footerText, lock, showSubmitButton } = this.props;
    const { height, show } = this.state;

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

    return (
      <div className="auth0-lock-cred-pane">
        <Header title={this.t(["title"], {__textOnly: true})} name={name} backHandler={backHandler && show && ::this.handleBack} backgroundUrl={backgroundUrl} backgroundColor={primaryColor} logoUrl={icon}/>
        <Placeholder delay={800} height={height} show={show} ref="content">
          <ReactTransitionGroup>
            {globalError && <GlobalError key="global-error" message={globalError} />}
          </ReactTransitionGroup>
          <div className="auth0-lock-content">
            <div className="auth0-lock-form">
              {header}
              {contentRender({focusSubmit: ::this.focusSubmit, lock})}
            </div>
          </div>
          {footer}
        </Placeholder>
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
    const { backHandler, lock } = this.props;
    this.reverse = true;
    backHandler(l.id(lock));
  }

  componentWillSlideIn(slide) {
    const node = ReactDOM.findDOMNode(this.refs.content);
    this.originalHeight = parseInt(window.getComputedStyle(node, null).height, 10);
    this.setState({height: slide.height, show: false});
  }

  componentDidSlideIn() {
    this.setState({height: this.originalHeight});
    setTimeout(() => this.setState({show: true}), 500);
  }

  componentWillSlideOut(callback) {
    const node = ReactDOM.findDOMNode(this.refs.content);
    const size = window.getComputedStyle(node, null).height;
    callback({height: parseInt(size, 10), reverse: this.reverse});
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
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.height) {

      if (!this.state.height || nextProps.height === "auto") {
        this.setState({height: nextProps.height});
        return;
      }

      // TODO: Instead of storing a flag to indicate whether or not we are
      // performing an animation, we should store the height we are going to.
      // Also use rAF.
      if (this.state.height != nextProps.height && !this.state.animating) {
        const frames = 10;
        let count = 0;
        let current = parseInt(this.state.height, 10);
        const last = parseInt(nextProps.height, 10);
        const step = Math.abs(current - last) / frames;
        const dir =  current < last ? 1 : -1;
        const dh  = step * dir;

        this.t = setInterval(() => {
          if (count < frames - 1) {
            this.setState({height: current, animating: true});
            current += dh;
            count++;
          } else {
            clearInterval(this.t);
            delete this.t;
            this.setState({height: last, animating: false});
          }
        }, 17);
      }
    }
  }

  componentWillUnmount() {
    if (this.t) {
      clearInterval(this.t);
    }
  }

  render() {
    const { children, delay, height, show } = this.props;
    const style = this.state.height ? {height: this.state.height} : {};

    return (
      <div style={style}>
        <div style={{visibility: show ? "visible" : "hidden"}}>
          {children}
        </div>
      </div>
    );
  }
}
