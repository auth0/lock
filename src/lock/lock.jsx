import React from 'react';
import SubmitButton from './submit_button';
import Header from '../header/header';

export default class Lock extends React.Component {
  componentDidMount() {
    setTimeout(() => { this.refs.lock.getDOMNode().className += ' opened' }, 10);
  }

  render() {
    const { lock, submitHandler } = this.props;

    const overlay = lock.getIn(["ui", "container"]) ?
      null : <div className="auth0-lock-overlay"/>;

    const lockID = lock.get("id");
    const icon = lock.getIn(["ui", "icon"]) || "";
    const showCloseButton = this.props.lock.getIn(["ui", "closable"]);
    const gravatar = lock.getIn(["ui", "gravatar"]) && lock.get("gravatar");

    const disableSubmit = lock.get("submitting");
    const showSubmit = !!submitHandler;
    const submit = showSubmit ? <SubmitButton disabled={disableSubmit} /> : null;

    return (
      <div className="auth0-lock" ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            <Header lockID={lockID} icon={icon} showCloseButton={showCloseButton} gravatar={gravatar}/>
            {React.cloneElement(React.Children.only(this.props.children), {lock: lock})}
            {submit}
            <a href="https://auth0.com/" target="_blank" className="auth0-lock-badge auth0-lock-icon"/>
          </form>
        </div>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    const { lock, submitHandler } = this.props;
    if (submitHandler) {
      submitHandler(lock);
    }
  }
}

Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};
