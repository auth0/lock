import React from 'react';
import Screen from './screen';
import { pinLoadingPane, unpinLoadingPane } from './actions';
import * as l from './index';

export default class LoadingScreen extends Screen {

  constructor() {
    super("loading");
  }

  render({lock}) {
    return <LoadingPane lock={lock} />;
  }

}

class LoadingPane extends React.Component {

  componentWillMount() {
    pinLoadingPane(l.id(this.props.lock));
  }

  componentDidMount() {
    setTimeout(() => unpinLoadingPane(l.id(this.props.lock)), 1200);
  }

  render() {
    return (
      <div className="auth0-loading-screen">
        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
      </div>
    );
  }

}

LoadingPane.propTypes = {
  lock: React.PropTypes.object.isRequired
};
