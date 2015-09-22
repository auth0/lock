import React from 'react/addons';
import GlobalError from './global_error';
import SubmitButton from './submit_button';
import Header from '../header/header';
import * as l from './index';
import * as g from '../gravatar/index';
import Terms from '../lock/terms';

const ReactTransitionGroup = React.addons.TransitionGroup;
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class CredPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {height: "", show: true};
  }

  componentDidMount() {
    this.reverse = false;
  }

  render() {
    const { auxiliaryPane, backHandler, className, lock, terms } = this.props;
    const { height, show } = this.state;

    const gravatar = l.gravatar(lock);
    const icon = l.ui.icon(lock);
    const globalError = l.globalError(lock);
    const disableSubmit = l.submitting(lock);

    let backgroundUrl, name;
    if (gravatar) {
      backgroundUrl = g.imageUrl(gravatar);
      name = g.displayName(gravatar);
    } else {
      backgroundUrl = icon;
      name = "";
    }

    return (
      <div className={className + " auth0-lock-cred-pane"}>
        <Header name={name} backHandler={backHandler && show && ::this.handleBack} backgroundUrl={backgroundUrl} logoUrl={icon}/>
        <Placeholder delay={800} height={height} show={show} ref="content">
          <ReactTransitionGroup>
            {globalError && <GlobalError key="global-error" message={globalError} />}
          </ReactTransitionGroup>
          <div className="auth0-lock-content">
            {this.props.children}
          </div>
          {terms && <Terms content={terms} />}
        </Placeholder>
        <SubmitButton ref="submit" disabled={disableSubmit} tabIndex={l.tabIndex(lock, 10)} />
        <ReactCSSTransitionGroup transitionName="slide">
          {auxiliaryPane}
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  focusSubmit() {
    this.refs.submit.focus();
  }

  handleBack() {
    this.reverse = true;
    this.props.backHandler();
  }

  componentWillSlideIn(slide) {
    const node = React.findDOMNode(this.refs.content);
    this.originalHeight = window.getComputedStyle(node, null).height;
    this.setState({height: slide.height, show: false});
  }

  componentDidSlideIn() {
    this.setState({height: this.originalHeight});
    setTimeout(() => this.setState({show: true}), 500);
  }

  componentWillSlideOut(callback) {
    const node = React.findDOMNode(this.refs.content);
    const size = window.getComputedStyle(node, null).height;
    callback({height: size, reverse: this.reverse});
  }
}

class Placeholder extends React.Component {
  render() {
    const { children, delay, height, show } = this.props;
    const transition = `height ${delay}ms`;
    const style = {
      height: height,
      transition: transition,
      "WebkitTransition": transition
    };

    return (
      <div style={style}>
        <div style={{display: show ? "block" : "none"}}>
          {children}
        </div>
      </div>
    );
  }
}
