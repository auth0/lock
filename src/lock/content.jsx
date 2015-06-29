import React from 'react';
import LoadingContent from './loading/content';
import CrashContent from './crash/content';
import SignInContent from './sign_in/content';
import { LockStates } from '../control/constants';

export default class Content extends React.Component {
  render() {
    switch(this.props.lock.get('state')) {
      case LockStates.WAITING_CLIENT_CONFIG:
        return <LoadingContent/>;
      case LockStates.CRASHED:
        return <CrashContent/>;
      default:
        // TODO this should turn into a switch statement that considers all the
        // possible modes.
        return <SignInContent lock={this.props.lock}/>;
    }
  }
}

Content.propTypes = {
  lock: React.PropTypes.object
};
