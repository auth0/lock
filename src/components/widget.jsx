import React from 'react';
import Content from './content';
import LockActionCreators from '../actions/lock_action_creators';
import { LockStates } from '../constants/app_constants';
import SubmitButton from './submit_button';

export default class Widget extends React.Component {
  // TODO extract components (header, tabs, inputs and so on)
  _handleSubmit(event) {
    event.preventDefault();
    LockActionCreators.signIn(this.props.lock.get("id"));
  }

  render() {
    var active = this.props.lock.get("state") === LockStates.SIGNING_IN;
    var submit = this.props.lock.get("state") === LockStates.WAITING_CLIENT_CONFIG ?
      null : <SubmitButton active={active} />;

    return (
      <form className="auth0-lock-widget" onSubmit={this._handleSubmit.bind(this)}>
        <div className="auth0-lock-header">
          <a href="#" className="auth0-lock-close auth0-lock-icon"/>
          <div className="auth0-lock-header-avatar"/>
          <div className="auth0-lock-header-welcome">
            <div className="auth0-lock-header-logo"/>
            Auth0
          </div>
          <div className="auth0-lock-header-logo-blurry"/>
        </div>

        <Content lock={this.props.lock}/>
        {submit}
      </form>
    );
  }
}
