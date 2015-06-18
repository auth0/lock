import React from 'react';
import Widget from './widget';
import AppStore from '../stores/app_store';
import { Map } from 'immutable';

export default class Lock extends React.Component {
  constructor() {
    super();
    // TODO don't set ready: false here
    this.state = {lock: Map({ready: false})};
    this._syncState = (lockID = this.props.id) => {
      this.setState({lock: AppStore.getLock(lockID)});
    }
  }

  componentDidMount() {
    AppStore.addChangeListener(this._syncState);
    // NOTE this.props is not accessible in constructor, so we can't include the
    // lock data in the initial state even if it's ready (which is always the
    // case, just the client part might not be there).
    // TODO think about how to handle this outside the component
    this._syncState();
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._syncState);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id != nextProps.id) {
      this._syncState(nextProps.id);
    }
  }

  render() {
    return (
      <div className="auth0-lock open">
        <div className="auth0-lock-overlay"/>
        <Widget lock={this.state.lock}/>
        <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
      </div>
    );
  }
}

Lock.propTypes = {
  id: React.PropTypes.string.isRequired
};
