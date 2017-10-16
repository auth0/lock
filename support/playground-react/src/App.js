import React, { Component } from 'react';
import './App.css';

import Header from './Header';
import PageTitle from './PageTitle';
import LockTypeSelector from './LockTypeSelector';
import Lock from './Lock';
import Logs from './Logs';
import LockMainOptionsSelector from './LockMainOptionsSelector';
import LockCustomization from './LockCustomization';

class App extends Component {
  constructor(p) {
    super(p);
    let state = {
      lockMode: 'lock',
      domain: 'brucke.auth0.com',
      clientId: 'pDLtKCAsWTNILITW8cPLgOLcpOSXjq7q',
      authParams: {
        scope: 'openid'
      },
      allowedConnections: ['acme', 'twitter', 'facebook', 'email'],
      passwordlessMethod: 'code',
      avatar: true,
      languageDictionary: {
        title: 'Hello!'
      },
      labeledSubmitButton: true,
      language: 'en',
      logo: 'https://i.imgur.com/IklrJlT.png',
      primaryColor: '#292929',
      allowShowPassword: true,
      logs: []
    };
    const localStorageState = window.localStorage['auth0-playground-state'];
    if (localStorageState) {
      state = JSON.parse(localStorageState);
    }
    this.state = state;
  }
  update = newState => {
    if (Object.keys(newState)[0] === 'logs') {
      console.log('state');
    }
    this.setState(
      newState,
      s => (window.localStorage['auth0-playground-state'] = JSON.stringify(this.state))
    );
  };
  render() {
    return (
      <div className="App">
        <Header />
        <PageTitle />
        <main>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <LockTypeSelector update={this.update} state={this.state} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <LockMainOptionsSelector update={this.update} state={this.state} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <LockCustomization update={this.update} state={this.state} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <Lock update={this.update} state={this.state} />
                </div>
              </div>
              <div className="row" style={{ marginTop: 15 }}>
                <div className="col-md-12">
                  <Logs update={this.update} state={this.state} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
