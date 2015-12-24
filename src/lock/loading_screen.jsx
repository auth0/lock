import React from 'react';
import Screen from './screen';

export default class LoadingScreen extends Screen {

  constructor() {
    super("loading");
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
