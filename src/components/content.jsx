import React from 'react';
import LoadingContent from './loading_content';
import SigninContent from './signin_content';
import { LockStates } from '../constants/app_constants';

export default class Content extends React.Component {
  render() {
    if (this.props.lock.get('state') === LockStates.WAITING_CLIENT_CONFIG) {
      return <LoadingContent/>;
    } else {
      // NOTE this should turn into a switch statement that considers all the
      // possible modes.
      return <SigninContent lock={this.props.lock}/>;
    }
  }
}

Content.propTypes = {
  lock: React.PropTypes.object
};
