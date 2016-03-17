import React from 'react';
import Screen from './screen';
import { pinLoadingPane, unpinLoadingPane } from './actions';
import * as l from './index';

export default class LoadingScreen extends Screen {

  constructor() {
    super("loading");
  }

  transitionName() {
    return "fade";
  }

  render({model}) {
    return <LoadingPane lock={model} />;
  }

}

class LoadingPane extends React.Component {

  componentDidMount() {
    const { lock } = this.props;
    pinLoadingPane(l.id(lock));
    setTimeout(() => unpinLoadingPane(l.id(lock)), 1200);
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
