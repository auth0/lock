import React from 'react';
import SubmitButton from './submit_button';
import Header from '../header/header';

export default class Widget extends React.Component {
  render() {
    const { lock, submitHandler } = this.props;

    var disableSubmit = this.props.lock.get("submitting");
    var showSubmit = !!submitHandler;
    var submit = showSubmit ? <SubmitButton disabled={disableSubmit} /> : null;

    var lockID = this.props.lock.get("id");
    var icon = this.props.lock.getIn(["showOptions", "icon"]) || "";
    var showCloseButton = true; // this.props.lock.getIn(["showOptions", "closable"]);
    const gravatar = this.props.lock.get("gravatar");

    return (
      <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
        <Header lockID={lockID} icon={icon} showCloseButton={showCloseButton} gravatar={gravatar}/>
        {React.cloneElement(this.props.children, {lock: lock})}
        {submit}
        <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    return this.props.submitHandler(this.props.lock);
  }
}
