import React from 'react';
import LoadingContent from './loading_content';
import SigninContent from './signin_content';

export default class Content extends React.Component {
  render() {
    // TODO this check should be easier
    if (this.props.lock.get('ready') === false ||
        this.props.lock.getIn(['client', 'loaded']) != true) {
      return <LoadingContent/>
    }
    return <SigninContent/>;
  }
}

// TODO specify prop types
