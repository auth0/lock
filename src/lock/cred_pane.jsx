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
  render() {
    const { auxiliaryPane, className, dimensions, lock, showTerms } = this.props;

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
        <Header name={name} backgroundUrl={backgroundUrl} logoUrl={icon}/>
        <ReactTransitionGroup>
          <Placeholder dimensions={dimensions}>
            <ReactTransitionGroup>
              {globalError && <GlobalError key="global-error" message={globalError} />}
            </ReactTransitionGroup>
            <div className="auth0-lock-content">
              {this.props.children}
            </div>
            {l.ui.terms(lock) && <Terms content={l.ui.terms(lock)} />}
          </Placeholder>
        </ReactTransitionGroup>
        <SubmitButton disabled={disableSubmit} />
        <ReactCSSTransitionGroup transitionName="slide">
          {auxiliaryPane}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

class Placeholder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: true};
  }

  render() {
    return <div>{this.state.show && this.props.children}</div>;
  }

  componentWillAppear(callback) {
    const { dimensions } = this.props;
    const node = React.findDOMNode(this);
    const height = window.getComputedStyle(node, null).height;
    const prevHeight = dimensions("credPane");
    if (!prevHeight) {
      dimensions("credPane", height);
      return;
    }

    this.setState({show: false});
    node.style.height = prevHeight;

    setTimeout(() => {
      this.setState({show: true})
      node.style.transition = "all 0.4s 0.8s";
      node.style.height = height;
      dimensions("credPane", height);
      callback();
    }, 800);
  }
}
