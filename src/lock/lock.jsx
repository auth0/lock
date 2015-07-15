import React from 'react';
import Widget from './widget';

export default class Lock extends React.Component {
  componentDidMount() {
    setTimeout(() => { this.refs.lock.getDOMNode().className += ' opened' }, 10);
  }

  render() {
    var overlay = this.props.lock.getIn(["showOptions", "container"]) ?
      null : <div className="auth0-lock-overlay"/>;
    return (
      <div className="auth0-lock" ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <Widget lock={this.props.lock}/>
        </div>
      </div>
    );
  }
}

Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};

// TODO try the layer pattern for auth0-lock-overlay and the iframe strategy for
// isolating the styles like Stripe does. Some markup changes will be needed.
// https://github.com/facebook/react/issues/379
// https://github.com/Khan/react-components/blob/master/js/layered-component-mixin.jsx
// https://github.com/react-bootstrap/react-bootstrap/blob/master/src/OverlayMixin.js
// https://www.npmjs.com/package/react-layer
// https://www.npmjs.com/package/react-iframe
// http://developer.zendesk.com/blog/2014/05/13/rendering-to-iframes-in-react/ (https://www.npmjs.com/package/react-frame-component)
