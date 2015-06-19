import React from 'react';
import Widget from './widget';

export default class Lock extends React.Component {
  render() {
    var overlay = this.props.lock.getIn(["showOptions", "container"]) ?
      null : <div className="auth0-lock-overlay"/>;
    return (
      <div className="auth0-lock open">
        {overlay}
        <Widget lock={this.props.lock}/>
        <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
      </div>
    );
  }
}

Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};
